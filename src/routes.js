// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Tables from "layouts/tables";
import Billing from "layouts/billing";
import RTL from "layouts/rtl";
import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import SignOut from "layouts/authentication/sign-out";

// @mui icons
import Icon from "@mui/material/Icon";
import BaptismRegistryComponent from "layouts/baptism-registry/baptism-registry.component";
import ConfirmationRegistryComponent from "layouts/confirmation-registry/confirmation-registry.component";
import UserManagementComponent from "layouts/user-management/user-management.component";

const routes = [
  {
    type: "collapse",
    name: "Baptismal Registry",
    key: "baptism_registry",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/baptism_registry",
    component: <BaptismRegistryComponent />,
  },
  {
    type: "collapse",
    name: "Confirmation Registry",
    key: "confirmation_registry",
    icon: <Icon fontSize="small">table_view</Icon>,
    route: "/confirmation_registry",
    component: <ConfirmationRegistryComponent />,
  },
  /**{
    type: "collapse",
    name: "RTL",
    key: "rtl",
    icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
    route: "/rtl",
    component: <RTL />,
  }*/
  {
    type: "collapse",
    name: "Users",
    route: "user-management",
    key: "user-management",
    icon: <Icon fontSize="small">group</Icon>,
    component: <UserManagementComponent />,
  },
  {
    type: "collapse",
    name: "Sign Out",
    route: "not-found",
    key: "sign-out",
    icon: <Icon fontSize="small">login</Icon>,
    component: <SignOut />,
  },
  
];

export default routes;
