import { ContextMenu } from "./components/ContextMenu";
import colors from "tailwindcss/colors";
import flatten from "flat";
import { TierList } from "./components/Tier";
import { UnrankedEntries } from "./components/UnrankedEntries";
import { contextMenuStore, entryStore } from "./store";
import { useStore } from "zustand";
import { useContext, useEffect } from "react";

export const flatColors: { [key: string]: string } = flatten(colors);

const App = () => {
	return (
		<>
			<AppContent />
		</>
	);
};

const AppContent = () => {
	return (
		<>
			<ContextMenu />
			<div className="h-screen bg-slate-400">
				<header className="flex-center py-5  bg-slate-700">
					<h1 className=" text-4xl">
						<span className="lowercase">tier</span>{" "}
						<span className="uppercase">forge</span>
					</h1>
				</header>
				<main className="h-full">
					<div className="flex mt-20 justify-around">
						<TierList />
						<UnrankedEntries />
					</div>
				</main>
				<footer className=" py-2 bg-slate-700"></footer>
			</div>
		</>
	);
};

export default App;
