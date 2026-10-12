import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Bell,
  PlusSquare,
  Infinity,
  UserRound,
} from "lucide-react";

const navigationitems = [
  { label: "Home", icon: Home },
  { label: "Search", icon: Search },
  { label: "Explore", icon: Compass },
  { label: "Messages", icon: MessageCircle },
  { label: "Notifications", icon: Bell },
  { label: "Create", icon: PlusSquare },
  { label: "My Loops", icon: Infinity },
  { label: "Profile", icon: UserRound },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r border-gray-200 bg-white px-4 py-6 md:flex md: flex-col">
      <div className="mb-10 flex items-center gap-2 px-3">
        <Infinity size={32} className="text-violet-600" />
        <span className="text-2xl font-bold tracking-tight">Loop</span>
      </div>
      <div>
        <nav className="flex flex-col gap-2">
          {navigationitems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              type="button"
              className={`flex items-center gap-4 rounded-xl px-4 py-2 text-left transition-colors  cursor-pointer
                  ${
                    label === "Search"
                      ? "bg-violet-600 font-semibold text-white"
                      : "text-gray-700 hover:bg-violet-50 hover:text-violet-700"
                  }`}
            >
              <Icon size={21} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 rounded-xl bg-gray-50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700">
            F
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Farhan</p>
            <p className="truncate text-xs font-semibold">@farhanisthis</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
