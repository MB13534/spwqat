/* eslint-disable import/first */
import React from "react";
import { CRUD_MODELS, ROUTES } from "../constants";
import { useAuth0 } from "@auth0/auth0-react";

import async from "../components/Async";

import {
  Activity,
  Database,
  FileText,
  Home,
  Monitor,
  Users,
  Map as MapIcon,
  Book,
  Share2,
} from "react-feather";

import Blank from "../pages/pages/Blank";
import Landing from "../pages/presentation/Landing";
import * as inflector from "inflected";
import { CrudProvider } from "../CrudProvider";

// TODO MAYBE LAZY IMPORT
import PublicMap from "../pages/publicMap";
import Default from "../pages/dashboards/Default";
import AdminGuard from "../components/AdminGuard";
import AdminVisibilityFilter from "../components/AdminVisibilityFilter";
import ListWqatActivityTypes from "../pages/dataManagement/ListWqatActivityTypes";
import ListWqatParameters from "../pages/dataManagement/ListWqatParameters";
import ListWqatOrganizations from "../pages/dataManagement/ListWqatOrganizations";
import ListWqatMediaTypes from "../pages/dataManagement/ListWqatMediaTypes";
import ListWqatLocations from "../pages/dataManagement/ListWqatLocations";
import ListWqatLocationTypes from "../pages/dataManagement/ListWqatLocationTypes";
import WhatIsWaterQuality from "../pages/storyLines/waterQuality/whatIsWaterQuality/WhatIsWaterQuality";
import EColi from "../pages/storyLines/waterQuality/eColi/EColi";
import Nutrients from "../pages/storyLines/waterQuality/nutrients/Nutrients";
import ContaminantsOfEmergingConcern from "../pages/storyLines/waterQuality/contaminantsOfEmergingConcern/ContaminantsOfEmergingConcern";
import TotalDissolvedSolids from "../pages/storyLines/waterQuality/totalDissolvedSolids/TotalDissolvedSolids";
import TotalSuspendedSolids from "../pages/storyLines/waterQuality/totalSuspendedSolids/TotalSuspendedSolids";
import ParameterGroupsToParameters from "../pages/dataManagement/associations";
import WaterQualityStorylineHome from "../pages/storyLines/waterQuality/WaterQualityStorylineHome";
import MetalsAndOtherTraceElements from "../pages/storyLines/waterQuality/metalsAndOtherTraceElements/MetalsAndOtherTraceElements";
const Account = async(() => import("../pages/pages/Account"));
const Profile = async(() => import("../pages/pages/Profile"));

const CrudIndexPage = async(() => import("../components/crud/CrudIndexPage"));
const CrudViewPage = async(() => import("../components/crud/CrudViewPage"));

const getSidebarMenu = (list) => {
  return list.map((item) => {
    const slug = inflector.dasherize(inflector.underscore(item.name));
    return {
      id: item.sidebarName ?? inflector.titleize(item.name),
      path: `/models/${slug}`,
      model: inflector.singularize(item.name),
      icon: item.icon || <Database />,
      component: CrudIndexPage,
      config: require(`../pages/models/${item.name}Config`),
      provider: CrudProvider,
      children: item.children,
      header: item.header,
      guard: item.guard,
      visibilityFilter: item.visibilityFilter,
    };
  });
};

const getCrudRoutes = (list) => {
  return list.map((item) => {
    const config = require(`../pages/models/${item.name}Config`);
    const slug = inflector.dasherize(inflector.underscore(item.name));

    return {
      id: inflector.titleize(item.name),
      path: `/models/${slug}`,
      model: inflector.singularize(item.name),
      component: CrudIndexPage,
      provider: CrudProvider,
      config,
      crud: [
        {
          path: `/models/${slug}/:id`,
          name: `View ${inflector.titleize(inflector.singularize(item.name))}`,
          component: CrudViewPage,
          provider: CrudProvider,
          model: inflector.singularize(item.name),
          config,
        },
        {
          path: `/models/${slug}/add`,
          name: `Add ${inflector.titleize(inflector.singularize(item.name))}`,
          component: CrudViewPage,
          provider: CrudProvider,
          model: inflector.singularize(item.name),
          config,
        },
      ],
    };
  });
};

const crudSidebarMenu = [...getSidebarMenu(CRUD_MODELS)];
const modelCrudRoutes = [...getCrudRoutes(CRUD_MODELS)];

const publicMapRoutes = {
  header: "Data Access",
  id: "Map Explorer",
  icon: <MapIcon />,
  path: "/data-access/map-explorer",
  name: "Map Explore",
  component: PublicMap,
};

const dataAccessRoutes = {
  id: "Graph Explorer",
  icon: <Activity />,
  path: "/data-access/graph-explorer",
  name: "Graph Explorer",
  component: Blank,
};

const reportsRoutes = {
  id: "Query & Download",
  icon: <FileText />,
  path: "/data-access/query-&-download",
  name: "Query & Download",
  component: Blank,
};

const dataScrubbingRoutes = {
  header: "Data Management",
  id: "Data Scrubbing",
  icon: <Database />,
  children: [
    {
      path: "/data-management/activity-types",
      name: "Activity Types",
      component: ListWqatActivityTypes,
      guard: AdminGuard,
    },
    {
      path: "/data-management/location-types",
      name: "Location Types",
      component: ListWqatLocationTypes,
      guard: AdminGuard,
    },
    {
      path: "/data-management/locations",
      name: "Locations",
      component: ListWqatLocations,
      guard: AdminGuard,
    },
    {
      path: "/data-management/media-types",
      name: "Media Types",
      component: ListWqatMediaTypes,
      guard: AdminGuard,
    },
    {
      path: "/data-management/organizations",
      name: "Organizations",
      component: ListWqatOrganizations,
      guard: AdminGuard,
    },
    {
      path: "/data-management/parameters",
      name: "Parameters",
      component: ListWqatParameters,
      guard: AdminGuard,
    },
    // {
    //   path: "/data-management/waterbodies",
    //   name: "Water Bodies",
    //   component: ListWqatWaterbodies,
    //   guard: AdminGuard,
    // },
  ],
  visibilityFilter: AdminVisibilityFilter,
};

const associationsRoutes = {
  id: "Associations",
  icon: <Share2 />,
  children: [
    {
      path: "/data-management/parameter-groups-to-parameters",
      name: "Parameter Groups to Parameters",
      component: ParameterGroupsToParameters,
      guard: AdminGuard,
      visibilityFilter: AdminVisibilityFilter,
    },
  ],
  guard: AdminGuard,
  visibilityFilter: AdminVisibilityFilter,
};

const accountRoutes = {
  id: "Account",
  path: "/account",
  name: "Account",
  header: "Pages",
  icon: <Users />,
  component: Account,
  children: [
    {
      path: ROUTES.USER_PROFILE,
      name: "Profile",
      component: Profile,
    },
    {
      path: "/auth/logout",
      name: "Logout",
      component: function Logout() {
        const { logout } = useAuth0();
        logout();
      },
    },
  ],
};

const landingRoutes = {
  id: "Landing Page",
  path: "/",
  header: "Docs",
  icon: <Monitor />,
  component: Landing,
  children: null,
};

const storylineHomeRoute = {
  id: "Storylines",
  path: "/storylines/water-quality",
  header: "Storylines",
  icon: <Book />,
  component: WaterQualityStorylineHome,
  children: null,
};

const mainRoutes = {
  header: "Dashboards",
  id: "Water Quality Assessment Tool",
  path: "/dashboard",
  icon: <Home />,
  component: Default,
  children: null,
  containsHome: true,
};

const storylinesRoutes = {
  header: "Storylines",
  id: "Water Quality",
  icon: <Book />,
  open: true,
  children: [
    // {
    //   path: "/storylines/water-quality",
    //   name: "Water Quality Home",
    //   component: WaterQualityStorylineHome,
    // },
    {
      path: "/storylines/water-quality/what-is-water-quality",
      name: "What is Water Quality?",
      component: WhatIsWaterQuality,
    },
    {
      path: "/storylines/water-quality/e-coli",
      name: "E. coli",
      component: EColi,
    },
    {
      path: "/storylines/water-quality/nutrients",
      name: "Nutrients",
      component: Nutrients,
    },
    {
      path: "/storylines/water-quality/contaminants-of-emerging-concern",
      name: "Contaminants of Emerging Concern",
      component: ContaminantsOfEmergingConcern,
    },
    {
      path: "/storylines/water-quality/total-dissolved-solids",
      name: "Total Dissolved Solids",
      component: TotalDissolvedSolids,
    },
    {
      path: "/storylines/water-quality/total-suspended-solids",
      name: "Total Suspended Solids",
      component: TotalSuspendedSolids,
    },
    {
      path: "/storylines/water-quality/metals-and-other-trace-elements",
      name: "Metals and Other Trace Elements",
      component: MetalsAndOtherTraceElements,
    },
  ],
};

// Routes using the Dashboard layout
export const dashboardLayoutRoutes = [
  mainRoutes,
  dataScrubbingRoutes,
  associationsRoutes,
  dataAccessRoutes,
  reportsRoutes,
  accountRoutes,
  storylinesRoutes,
  storylineHomeRoute,
];

export const dashboardMaxContentLayoutRoutes = [
  ...crudSidebarMenu,
  ...modelCrudRoutes,
  publicMapRoutes,
];

// Routes using the Auth layout
export const authLayoutRoutes = [accountRoutes];

// Routes using the Presentation layout
export const presentationLayoutRoutes = [landingRoutes];

// Routes using the full screen map layout
export const fullscreenMapRoutes = [];

// Routes visible in the sidebar
export const sidebarRoutes = [
  mainRoutes,
  ...crudSidebarMenu,
  dataScrubbingRoutes,
  associationsRoutes,
  publicMapRoutes,
  dataAccessRoutes,
  reportsRoutes,
  storylinesRoutes,
];
