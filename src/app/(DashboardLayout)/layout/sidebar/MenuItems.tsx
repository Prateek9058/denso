import { uniqueId } from "lodash";
import dashboard from "../../../../../public/Img/dashboardActive.png";
import manPower from "../../../../../public/Img/manpower.png";
import manPowerActive from "../../../../../public/Img/manpowwerActive.png";
import trolly from "../../../../../public/Img/trolley.png";
import trollyActive from "../../../../../public/Img/trollyActive.png";
import attendance from "../../../../../public/Img/attendance.png";
import attendanceActive from "../../../../../public/Img/attendanceActive.png";
import dasboardIcon from "../.../../../../.././../public/Img/dashboard.png";
import setting from "../.../../../../.././../public/Img/setting1.png";
import alert from "../.../../../../.././../public/Img/alerts.png";
import settingActive from "../.../../../../.././../public/Img/setting2Active.png";
import alertActive from "../.../../../../.././../public/Img/alertsActive.png";
import Organization from "../.../../../../.././../public/Img/gg_organisation.png";
import OrganizationAct from "../.../../../../.././../public/Img/gg_organisationActive.png";
import Maintence from "../.../../../../.././../public/Img/maintenceT.png";
import MaintenceAct from "../.../../../../.././../public/Img/maintenaceAct.png";
const Menuitems = [
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: dashboard,
    iconActive: dasboardIcon,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Manpower Tracking",
    icon: manPower,
    iconActive: manPowerActive,
    href: "/man-power-tracking",
  },
  {
    id: uniqueId(),
    title: "Trolley Tracking",
    icon: trolly,
    iconActive: trollyActive,
    href: "/trolley",
  },
  {
    id: uniqueId(),
    title: "Attendance Details",
    icon: attendance,
    iconActive: attendanceActive,
    href: "/attendance",
  },
  {
    id: uniqueId(),
    title: "Trolley maintenance",
    icon: Maintence,
    iconActive: MaintenceAct,
    href: "/maintenance",
  },
  {
    id: uniqueId(),
    title: "Organization",
    icon: Organization,
    iconActive: OrganizationAct,
    href: "/organization",
  },
  {
    id: uniqueId(),
    title: "Alerts",
    icon: alert,
    iconActive: alertActive,
    href: "/alerts",
  },

  {
    id: uniqueId(),
    title: "Setting",
    icon: setting,
    iconActive: settingActive,
    href: "/user-management",
  },
];

export default Menuitems;
