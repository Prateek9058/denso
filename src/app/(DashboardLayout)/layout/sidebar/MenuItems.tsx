import dashboard from "../../../../../public/Img/dashboardActive.png";
import manPower from "../../../../../public/Img/manpower.png";
import manPowerActive from "../../../../../public/Img/manpowwerActive.png";
import trolly from "../../../../../public/Img/trolley.png";
import trollyActive from "../../../../../public/Img/trollyActive.png";
import trolleyIcon from "../../../../../public/Img/trolleyHistrotyIcon.png";
import activeTrolleyIcon from "../../../../../public/Img/activeTrolleyHistrotyIcon.png";
import dasboardIcon from "../.../../../../.././../public/Img/dashboard.png";
import setting from "../.../../../../.././../public/Img/setting1.png";
import alert from "../.../../../../.././../public/Img/alerts.png";
import settingActive from "../.../../../../.././../public/Img/setting2Active.png";
import alertActive from "../.../../../../.././../public/Img/alertsActive.png";
import Organization from "../.../../../../.././../public/Img/gg_organisation.png";
import OrganizationAct from "../.../../../../.././../public/Img/gg_organisationActive.png";
import Maintence from "../.../../../../.././../public/Img/maintenceT.png";
import MaintenceAct from "../.../../../../.././../public/Img/maintenaceAct.png";
import UserManagementIcon from "../.../../../../.././../public/Img/userManagementIcon.png";
import UserManagementActiveIcon from "../.../../../../.././../public/Img/userManagementActiveIcon.png";
const Menuitems = [
  {
    id: "dashboard", // Use 'key' as 'id'
    title: "Dashboard",
    icon: dashboard,
    iconActive: dasboardIcon,
    href: "/dashboard",
    key: "dashboard",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "manpowerTracking",
    title: "Manpower Tracking",
    icon: manPower,
    iconActive: manPowerActive,
    href: "/man-power-tracking",
    key: "manpowerTracking",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "trolleyTracking",
    title: "Trolley Tracking",
    icon: trolly,
    iconActive: trollyActive,
    href: "/trolley",
    key: "trolleyTracking",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "maintenance",
    title: "Trolley maintenance",
    icon: Maintence,
    iconActive: MaintenceAct,
    href: "/maintenance",
    key: "maintenance",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "user",
    title: "User management",
    icon: UserManagementIcon,
    iconActive: UserManagementActiveIcon,
    href: "/userManagement",
    key: "user",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "department",
    title: "Department",
    icon: Organization,
    iconActive: OrganizationAct,
    href: "/department",
    key: "department",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "alerts",
    title: "Alerts",
    icon: alert,
    iconActive: alertActive,
    href: "/alerts",
    key: "alerts",
    role: ["Admin", "subAdmin"],
  },
  {
    id: "setting",
    title: "Setting",
    icon: setting,
    iconActive: settingActive,
    href: "/settings",
    key: "setting",
    role: ["Admin", "subAdmin"],
  },
];

export default Menuitems;
