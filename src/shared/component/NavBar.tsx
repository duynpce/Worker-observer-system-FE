type NavBarProps<T extends string> = {
  tabs: readonly T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
};

const NavBar = <T extends string>({ tabs, activeTab, onTabChange }: NavBarProps<T>) => {
  return (
    <nav className="flex min-w-0 flex-1 gap-8 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => onTabChange(tab)}
          className={`pb-3 text-sm font-medium transition-colors ${
            activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default NavBar;
