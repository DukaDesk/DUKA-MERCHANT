const templateDefaults = {
  Custom: {
    meta: { appName: "My App", category: "Custom", primaryColor: "#1A1A2E", secondaryColor: "#E8E8F0" },
    navigation: { initialScreen: "screen_home", tabs: [] },
    shared: {
      header: { id: "section_header", type: "header", name: "Header", backgroundColor: "#FCF8FA", components: [{ id: "h_logo", type: "header_bar", props: { logo: null, appName: "My App" } }] },
      footer: { id: "section_footer", type: "footer", name: "Footer", backgroundColor: "#FCF8FA", components: [] },
    },
    screens: {
      screen_home: { name: "Home", backgroundColor: "#FCF8FA", bodySections: [] },
    },
  },
};

export default templateDefaults;
