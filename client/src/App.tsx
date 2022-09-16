import { ContextMenu } from "./components/ContextMenu/ContextMenu";
import colors from "tailwindcss/colors";
import flatten from "flat";
import { TierList } from "./components/Tier";
import { SolidButton, SubmitButton } from "./components/Button";
import React, {
	ChangeEvent,
	Fragment,
	ReactNode,
	useRef,
	useState,
} from "react";
import { useStore } from "zustand";
import { entryStore, EntryType } from "./store/EntryStore";
import { Entry } from "./components/Entry";
import { QueryClient, QueryClientProvider } from "react-query";
import { trpcHooks } from "./utils/trpcHooks";

const port = import.meta.env.PORT;

export const flatColors: { [key: string]: string } = flatten(
	Object.entries(colors)
		.slice(3)
		.reduce((acc, [k, v]) => {
			acc[k] = v;
			return acc;
		}, {} as { [key: string]: string })
);

const CategoryHeading = ({ children }: { children: ReactNode }) => {
	return <h2 className="indent-5 text-3xl font-medium">{children}</h2>;
};

const CategoryContent = ({ children }: { children?: ReactNode }) => {
	return (
		<div className="mx-4 my-2 bg-slate-200 px-5 py-10  stack-center rounded-lg">
			{children}
		</div>
	);
};

type Template = {
	name: string;
	keepEntries: boolean;
};

const TemplateCategory = () => {
	const [template, setTemplate] = useState<Template>({
		name: "",
		keepEntries: false,
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("sayonara");
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value, checked, type, name } = e.target;
		setTemplate((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	return (
		<>
			<CategoryHeading>Template</CategoryHeading>
			<CategoryContent>
				<div className="container stack gap-2">
					<div className="stack gap-2">
						<label htmlFor="INPUT_TEMPLATE_NAME">
							What should this template be called?
						</label>
						<input
							className="basis-full"
							id="INPUT_TEMPLATE_NAME"
							type="text"
							onChange={handleChange}
							required
							form="template-form"
							name={"name"}
							value={template.name}
						/>
					</div>
					<div className="flex items-center gap-2">
						<input
							id="INPUT_TEMPLATE_KEEP"
							onChange={handleChange}
							type="checkbox"
							checked={template.keepEntries}
							name="keepEntries"
						/>
						<label htmlFor="INPUT_TEMPLATE_KEEP">
							Keep Current Entries
						</label>
					</div>
					<SubmitButton
						disabled={template.name.length < 1}
						form="template-form">
						Create Template
					</SubmitButton>
				</div>
				<form id="template-form" onSubmit={handleSubmit}></form>
			</CategoryContent>
		</>
	);
};

const EntriesCategory = () => {
	const fileUploadRef = useRef<HTMLInputElement>(null);
	const triggerFileUpload = () => fileUploadRef.current?.click();
	const { addEntry, removeTier, entries } = useStore(entryStore);

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const { files } = e.currentTarget;
		console.log("files uploaded:\n", files);
		const filesWithID = [...files!].map((file) => {
			const src = URL.createObjectURL(file);
			return { src } as EntryType;
		});
		addEntry(filesWithID);
	};

	const handleClearAll = () => {
		removeTier(null);
	};

	const Content = () => {
		if (
			entries.filter(({ tierName }) => !tierName).length < 1 ||
			entries.length < 1
		) {
			return (
				<div>
					<p>
						Drop images or{" "}
						<SolidButton onClick={triggerFileUpload}>
							browse
						</SolidButton>{" "}
					</p>
					<input
						type="file"
						multiple
						accept="image/png, image/jpeg"
						ref={fileUploadRef}
						onChange={handleFileUpload}
						className="hidden"
					/>
				</div>
			);
		}

		return (
			<div>
				<div className="button-group justify-center">
					<SolidButton>Browse</SolidButton>
					<SolidButton onClick={handleClearAll}>
						Clear
					</SolidButton>
				</div>
				<ul className="mt-6 border-2 grid grid-cols-unranked gap-1 h-5/6 overflow-y-auto">
					{entries.map((entry) => {
						if (!entry.tierName) {
							return (
								<li className="" key={entry.id}>
									<Entry entry={entry} />
								</li>
							);
						}
					})}
				</ul>
			</div>
		);
	};

	return (
		<Fragment>
			<CategoryHeading>Entries</CategoryHeading>
			<CategoryContent>
				<Content />
			</CategoryContent>
		</Fragment>
	);
};

const UnrankedEntries = () => {
	return (
		<div className="stack basis-3/6 left-0 bg-slate-600 p-3">
			<TemplateCategory />
			<EntriesCategory />
		</div>
	);
};

const AppContent = () => {
	return (
		<>
			<ContextMenu />
			<div className="stack h-full bg-slate-400">
				<header className="flex-center py-5 basis-1/12 bg-slate-700">
					<h1 className="text-4xl">
						<span className="lowercase">tier</span>{" "}
						<span className="uppercase">forge</span>
					</h1>
				</header>
				<main className="flex container basis-full  overflow-y-auto">
					<UnrankedEntries />
					<div className="flex mt-5 mx-2  basis-full justify-around">
						<TierList />
					</div>
				</main>
				<footer className="mt-auto py-2 bg-slate-700 basis-[3%]"></footer>
			</div>
		</>
	);
};

const TRPCProvider = ({ children }: { children: ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient());
	const [trpcClient] = useState(() =>
		trpcHooks.createClient({
			url: `http://localhost:${port ?? 3500}/trpc`,
		})
	);

	return (
		<trpcHooks.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</trpcHooks.Provider>
	);
};

const App = () => {
	return (
		<TRPCProvider>
			<AppContent />
		</TRPCProvider>
	);
};

export default App;
