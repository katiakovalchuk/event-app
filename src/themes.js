import { createGlobalStyle } from "styled-components";
export const lightTheme = {
  body: "#fff",
  font: "#fff",
  color: "#4285f4 !important",
  fontSize: "12px",
};

export const darkTheme = {
  body: "#0d1117",
  font: "#000",
  color: "#fff",
  fontSize: "24px",
  navbarBgc: "#161b22",
  tableTh: "#161b22 !important",
  tableBg: "#212529 !important",
  tableBorderColor: "#373b3e !important",
  tableStripedBg: "#2c3034 !important",
  ableStripedColor: "#fff !important",
  tableActiveBg: "#373b3e !important",
  tableActiveColor: "#fff !important",
  tableHoverBg: "#323539 !important",
  tableHoverColor: "#fff !important",
  tableColor: "#fff !important",
  borderColor: "#373b3e !important",
  none: "none !important",
  block: "block",
  eventList: "#0d1117",
  buttonColor: "#21262d !important",
  buttonBorder: "1px solid #f0f6fc1a !important",
  buttonHoverColor: "#30363d !important",
  buttonHoverBorder: "1px solid #8b949e !important",
  fontBtn: "#000",
  appDesc: "#000000c7",
};

export const GlobalStyles = createGlobalStyle`

  body {
    background-color: ${(props) => props.theme.body}
  }
  .members-table th, .table-admin th {
    background-color: ${(props) => props.theme.tableTh}
  }
  .event__list {
    background-color: ${(props) => props.theme.eventList}
  }
  .navbar, .nav-menu, .navbar-toggle {
    background-color: ${(props) => props.theme.navbarBgc}
  }
  .nav-text a:hover svg {
    fill: ${(props) => props.theme.navbarBgc} 
   
  }
  .nav-text a:hover {
    color: ${(props) => props.theme.navbarBgc}
  }
  table {
    --bs-table-color: ${(props) => props.theme.tableColor};
    --bs-table-bg: ${(props) => props.theme.tableBg};
    --bs-table-border-color: ${(props) => props.theme.tableBorderColor};
    --bs-table-striped-bg: ${(props) => props.theme.tableStripedBg};
    --bs-table-striped-color: ${(props) => props.theme.ableStripedColor};
    --bs-table-active-bg: ${(props) => props.theme.tableActiveBg};
    --bs-table-active-color: ${(props) => props.theme.tableActiveColor}.
    --bs-table-hover-bg: ${(props) => props.theme.tableHoverBg};
    --bs-table-hover-color: ${(props) => props.theme.tableHoverColor};
    color: ${(props) => props.theme.tableColor};
    border-color: ${(props) => props.theme.borderColor};
  }
  table tr th {
    --bs-table-accent-bg: ${(props) => props.theme.none};
  }
  button {
    background-color: ${(props) => props.theme.buttonColor};
    border:  ${(props) => props.theme.buttonBorder}
  }
  button:hover {
    background-color: ${(props) => props.theme.buttonHoverColor};
    border:  ${(props) => props.theme.buttonHoverBorder}
  }
  .active>.page-link, .page-link.active {
    background-color: ${(props) => props.theme.buttonColor};
    border:  ${(props) => props.theme.buttonBorder}
  }
  .disabled>.page-link, .page-link.disabled {
    border:  ${(props) => props.theme.buttonBorder}
  }
  .page-link {
    color: ${(props) => props.theme.fontBtn}
  }
  .form-label {
    color: ${(props) => props.theme.tableHoverColor}
  }
  .app-description {
    background-color: ${(props) => props.theme.appDesc};
  }
  .form-check-input:checked {
    background-color: ${(props) => props.theme.appDesc};
    border: ${(props) => props.theme.none}
  }
`;
