import { createMuiTheme } from '@material-ui/core/styles';

// TEST AND PLAY BELOW
// https://material-ui.com/customization/color/#playground
// https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=D50000&secondary.color=EF5350
// https://codepen.io/codotronix/pen/NWRXjVp


// $themeColor: #d50000; // #d50000 red accent-4 // #e65100 orange darken-4   // #f44336 red;
// $themeColorAlpha: rgba(213, 0, 0, 0.3);          //#e6510080;    // themeColor appended with 80. for .5 alpha
// $themeColorDisabled: #ff9e80; //deep-orange accent-1
// $themeColorLight: #ffcdd2;  // red lighten-4
// $themeColorDark: darkred;
// $themeColorDarker: rgb(113, 0, 0);
// $textLight: #e57373; // red lighten-2
// $iconColor: #ff7043; //deep-orange lighten-1 //#ef5350; // red lighten-1 // used for many things, not only icons

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#dd3333',
      main: '#d50000',
      dark: '#950000',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#fff',
    },
  },
  typography: {
    fontFamily: [
      '"Exo"',
      'sans-serif'
    ].join(','),
  },
  props: {
    MuiButton: {
      size: 'small',
    },
  }
});

export default theme