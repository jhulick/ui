/* jshint -W079 */
var mockData = (function() {
    return {
        getBarChart: getBarChart,
        getBarstackedChart: getBarstackedChart,
        getMockStates: getMockStates,
        getSplineChart: getSplineChart,
        getAreaChart: getAreaChart,
        getLineChart: getLineChart,
        getPieChart: getPieChart,
        getDonutChart: getDonutChart,
        getEnData: getEnData,
        getSidebarMenu: getSidebarMenu,
        getMockEvents: getMockEvents,
        getMockNgTable: getMockNgTable,
        getMockXeditableTable: getMockXeditableTable,
        getCities: getCities,
        getStates: getStates
    };

    function getCities() {
        return ["Amsterdam","Washington","Sydney","Beijing","Cairo"];
    }

    function getStates() {
        return [
            "Alabama",
            "Alaska",
            "Arizona",
            "Arkansas",
            "California",
            "Colorado",
            "Connecticut",
            "Delaware",
            "Florida",
            "Georgia",
            "Hawaii",
            "Idaho",
            "Illinois",
            "Indiana",
            "Iowa",
            "Kansas",
            "Kentucky",
            "Louisiana",
            "Maine",
            "Maryland",
            "Massachusetts",
            "Michigan",
            "Minnesota",
            "Mississippi",
            "Missouri",
            "Montana",
            "Nebraska",
            "Nevada",
            "New Hampshire",
            "New Jersey",
            "New Mexico",
            "New York",
            "North Carolina",
            "North Dakota",
            "Ohio",
            "Oklahoma",
            "Oregon",
            "Pennsylvania",
            "Rhode Island",
            "South Carolina",
            "South Dakota",
            "Tennessee",
            "Texas",
            "Utah",
            "Vermont",
            "Virginia",
            "Washington",
            "West Virginia",
            "Wisconsin",
            "Wyoming"
        ];
    }

    function getMockXeditableTable() {
        return [{
            "id": 1,
            "text": "user"
        }, {
            "id": 2,
            "text": "customer"
        }, {
            "id": 3,
            "text": "vip"
        }, {
            "id": 4,
            "text": "admin"
        }];
    }

    function getMockNgTable() {
        return {
            "total": "15",
            "result": [{
                "name": "Jacob",
                "age": "27",
                "money": "-201"
            }, {
                "name": "Nephi",
                "age": "29",
                "money": "100"
            }, {
                "name": "Enos",
                "age": "34",
                "money": "-52.5"
            }, {
                "name": "Tiancum",
                "age": "43",
                "money": "52.1"
            }, {
                "name": "Jacob",
                "age": "27",
                "money": "110"
            }, {
                "name": "Nephi",
                "age": "29",
                "money": "-55"
            }, {
                "name": "Enos",
                "age": "34",
                "money": "551"
            }, {
                "name": "Tiancum",
                "age": "43",
                "money": "-1410"
            }, {
                "name": "Jacob",
                "age": "27",
                "money": "410"
            }, {
                "name": "Nephi",
                "age": "29",
                "money": "100"
            }, {
                "name": "Enos",
                "age": "34",
                "money": "-100"
            }, {
                "name": "Nephi",
                "age": "29",
                "money": "100"
            }, {
                "name": "Enos",
                "age": "34",
                "money": "-52.5"
            }, {
                "name": "Tiancum",
                "age": "43",
                "money": "52.1"
            }, {
                "name": "Jacob",
                "age": "27",
                "money": "110"
            }]
        };
    }

    /**
     * Creates an array of events to display in the first load of the calendar
     * Wrap into this function a request to a source to get via ajax the stored events
     * @return Array The array with the events
     */
    function getMockEvents() {
        // Date for the calendar events (dummy data)
        var date = new Date();
        var d = date.getDate(),
            m = date.getMonth(),
            y = date.getFullYear();

        return [
            {
                title: 'All Day Event',
                start: new Date(y, m, 1),
                backgroundColor: '#f56954', //red
                borderColor: '#f56954' //red
            },
            {
                title: 'Long Event',
                start: new Date(y, m, d - 5),
                end: new Date(y, m, d - 2),
                backgroundColor: '#f39c12', //yellow
                borderColor: '#f39c12' //yellow
            },
            {
                title: 'Meeting',
                start: new Date(y, m, d, 10, 30),
                allDay: false,
                backgroundColor: '#0073b7', //Blue
                borderColor: '#0073b7' //Blue
            },
            {
                title: 'Lunch',
                start: new Date(y, m, d, 12, 0),
                end: new Date(y, m, d, 14, 0),
                allDay: false,
                backgroundColor: '#00c0ef', //Info (aqua)
                borderColor: '#00c0ef' //Info (aqua)
            },
            {
                title: 'Birthday Party',
                start: new Date(y, m, d + 1, 19, 0),
                end: new Date(y, m, d + 1, 22, 30),
                allDay: false,
                backgroundColor: '#00a65a', //Success (green)
                borderColor: '#00a65a' //Success (green)
            },
            {
                title: 'Open Google',
                start: new Date(y, m, 28),
                end: new Date(y, m, 29),
                url: '//google.com/',
                backgroundColor: '#3c8dbc', //Primary (light-blue)
                borderColor: '#3c8dbc' //Primary (light-blue)
            }
        ];
    }

    function getSidebarMenu() {
        return [
            {
                "text": "Main Navigation",
                "heading": "true",
                "translate": "sidebar.heading.HEADER"
            },
            {
                "text": "Dashboard",
                "sref": "app.dashboard",
                "icon": "icon-speedometer",
                "translate": "sidebar.nav.DASHBOARD"
            },
            {
                "text": "Documentation",
                "sref": "app.documentation",
                "icon": "icon-graduation",
                "translate": "sidebar.nav.DOCUMENTATION"
            }
        ];
    }

    function getMockStates() {
        return [
            {
                state: 'app.chart-flot',
                config: {
                    url: '/chart-flot',
                    title: 'Chart Flot',
                    templateUrl: 'js/modules/charts/views/chart-flot.html'
                }
            },
            {
                state: 'app.chart-radial',
                config: {
                    url: '/chart-radial',
                    title: 'Chart Radial',
                    templateUrl: 'js/modules/charts/views/chart-radial.html'
                }
            },
            {
                state: 'app.chart-js',
                config: {
                    url: '/chart-js',
                    title: 'Chart JS',
                    templateUrl: 'js/modules/charts/views/chart-js.html'
                }
            }
        ];
    }

    function getBarChart() {
        return [
            {
                "label": "Sales",
                "color": "#9cd159",
                "data": [
                    ["Jan", 27],
                    ["Feb", 82],
                    ["Mar", 56],
                    ["Apr", 14],
                    ["May", 28],
                    ["Jun", 77],
                    ["Jul", 23],
                    ["Aug", 49],
                    ["Sep", 81],
                    ["Oct", 20]
                ]
            }
        ];
    }

    function getBarstackedChart() {
        return [{
            "label": "Tweets",
            "color": "#51bff2",
            "data": [
                ["Jan", 56],
                ["Feb", 81],
                ["Mar", 97],
                ["Apr", 44],
                ["May", 24],
                ["Jun", 85],
                ["Jul", 94],
                ["Aug", 78],
                ["Sep", 52],
                ["Oct", 17],
                ["Nov", 90],
                ["Dec", 62]
            ]
        }, {
            "label": "Likes",
            "color": "#4a8ef1",
            "data": [
                ["Jan", 69],
                ["Feb", 135],
                ["Mar", 14],
                ["Apr", 100],
                ["May", 100],
                ["Jun", 62],
                ["Jul", 115],
                ["Aug", 22],
                ["Sep", 104],
                ["Oct", 132],
                ["Nov", 72],
                ["Dec", 61]
            ]
        }, {
            "label": "+1",
            "color": "#f0693a",
            "data": [
                ["Jan", 29],
                ["Feb", 36],
                ["Mar", 47],
                ["Apr", 21],
                ["May", 5],
                ["Jun", 49],
                ["Jul", 37],
                ["Aug", 44],
                ["Sep", 28],
                ["Oct", 9],
                ["Nov", 12],
                ["Dec", 35]
            ]
        }];
    }

    function getSplineChart() {
        return [{
            "label": "Home",
            "color": "#1ba3cd",
            "data": [
                ["1", 38],
                ["2", 40],
                ["3", 42],
                ["4", 48],
                ["5", 50],
                ["6", 70],
                ["7", 145],
                ["8", 70],
                ["9", 59],
                ["10", 48],
                ["11", 38],
                ["12", 29],
                ["13", 30],
                ["14", 22],
                ["15", 28]
            ]
        }, {
            "label": "Overall",
            "color": "#3a3f51",
            "data": [
                ["1", 16],
                ["2", 18],
                ["3", 17],
                ["4", 16],
                ["5", 30],
                ["6", 110],
                ["7", 19],
                ["8", 18],
                ["9", 110],
                ["10", 19],
                ["11", 16],
                ["12", 10],
                ["13", 20],
                ["14", 10],
                ["15", 20]
            ]
        }]
    }

    function getAreaChart() {
        return [{
            "label": "Uniques",
            "color": "#aad874",
            "data": [
                ["Mar", 50],
                ["Apr", 84],
                ["May", 52],
                ["Jun", 88],
                ["Jul", 69],
                ["Aug", 92],
                ["Sep", 58]
            ]
        }, {
            "label": "Recurrent",
            "color": "#7dc7df",
            "data": [
                ["Mar", 13],
                ["Apr", 44],
                ["May", 44],
                ["Jun", 27],
                ["Jul", 38],
                ["Aug", 11],
                ["Sep", 39]
            ]
        }];
    }

    function getLineChart() {
        return [
            {
                "label": "Complete",
                "color": "#5ab1ef",
                "data": [
                    ["Jan", 188],
                    ["Feb", 183],
                    ["Mar", 185],
                    ["Apr", 199],
                    ["May", 190],
                    ["Jun", 194],
                    ["Jul", 194],
                    ["Aug", 184],
                    ["Sep", 74]
                ]
            }, {
                "label": "In Progress",
                "color": "#f5994e",
                "data": [
                    ["Jan", 153],
                    ["Feb", 116],
                    ["Mar", 136],
                    ["Apr", 119],
                    ["May", 148],
                    ["Jun", 133],
                    ["Jul", 118],
                    ["Aug", 161],
                    ["Sep", 59]
                ]
            }, {
                "label": "Cancelled",
                "color": "#d87a80",
                "data": [
                    ["Jan", 111],
                    ["Feb", 97],
                    ["Mar", 93],
                    ["Apr", 110],
                    ["May", 102],
                    ["Jun", 93],
                    ["Jul", 92],
                    ["Aug", 92],
                    ["Sep", 44]
                ]
            }
        ];
    }

    function getPieChart() {
        return [{
            "label": "jQuery",
            "color": "#4acab4",
            "data": 30
        }, {
            "label": "CSS",
            "color": "#ffea88",
            "data": 40
        }, {
            "label": "LESS",
            "color": "#ff8153",
            "data": 90
        }, {
            "label": "SASS",
            "color": "#878bb6",
            "data": 75
        }, {
            "label": "Jade",
            "color": "#b2d767",
            "data": 120
        }];
    }

    function getDonutChart() {
        return [
            {
                "color" : "#39C558",
                "data" : 60,
                "label" : "Coffee"
            },
            {
                "color" : "#00b4ff",
                "data" : 90,
                "label" : "CSS"
            },
            {
                "color" : "#FFBE41",
                "data" : 50,
                "label" : "LESS"
            },
            {
                "color" : "#ff3e43",
                "data" : 80,
                "label" : "Jade"
            },
            {
                "color" : "#937fc7",
                "data" : 116,
                "label" : "AngularJS"
            }
        ];
    }

    function getEnData() {
        return {
            "dashboard": {
                "WELCOME": "Welcome to {{appName}}"
            },
            "topbar": {
                "messages": {
                    "UNREAD": "Unread messages",
                    "MORE": "More messages"
                },
                "search": {
                    "PLACEHOLDER": "Type and hit enter.."
                },
                "notification": {
                    "MORE": "More notifications"
                }
            },
            "offsidebar": {
                "setting": {
                    "SETTINGS": "Settings",
                    "THEMES": "Themes",
                    "layout": {
                        "FIXED": "Fixed",
                        "COLLAPSED": "Collapsed"
                    }
                },
                "chat": {
                    "CONNECTIONS": "Connections",
                    "SEARCH": "Search contacts",
                    "ONLINE": "ONLINE",
                    "OFFLINE": "OFFLINE",
                    "LOAD_MORE": "Load More",
                    "TASK_COMPLETION": "Tasks completion",
                    "QUOTA": "Upload Quota"
                }
            },
            "sidebar": {
                "WELCOME": "Welcome",
                "heading": {
                    "HEADER": "Main Navigation",
                    "COMPONENTS": "Components",
                    "MATERIAL": "Angular Material",
                    "MORE": "More"
                },
                "nav": {
                    "DASHBOARD": "Dashboard",
                    "WIDGETS": "Widgets",
                    "DOCUMENTATION": "Documentation",
                    "material": {
                        "AUTOCOMPLETE": "Autocomplete",
                        "BUTTON": "Button",
                        "CHECKBOX": "Checkbox",
                        "CONTENT": "Content",
                        "DIALOG": "Dialog",
                        "DIVIDER": "Divider"
                    },
                    "element": {
                        "ELEMENTS": "Elements",
                        "BUTTON": "Button",
                        "COLOR": "Colors",
                        "NOTIFICATION": "Notification",
                        "INTERACTION": "Interaction",
                        "SPINNER": "Spinner",
                        "ANIMATION": "Animation",
                        "DROPDOWN": "Dropdown",
                        "PANEL": "Panel",
                        "PORTLET": "Portlet",
                        "GRID": "Grid",
                        "GRID_MASONRY": "Grid Masonry",
                        "TYPO": "Typography",
                        "FONT_ICON": "Font Icons",
                        "WEATHER_ICON": "Weather Icons"
                    },
                    "form": {
                        "FORM": "Forms",
                        "STANDARD": "Standard",
                        "EXTENDED": "Extended",
                        "VALIDATION": "Validation",
                        "WIZARD": "Wizard",
                        "UPLOAD": "Upload"
                    },
                    "chart": {
                        "CHART": "Charts",
                        "FLOT": "Flot",
                        "RADIAL": "Radial"
                    },
                    "table": {
                        "TABLE": "Table",
                        "STANDARD": "Standard",
                        "EXTENDED": "Extended",
                        "DATATABLE": "Datatable"
                    },
                    "map": {
                        "MAP": "Maps",
                        "GOOGLE": "Google Map",
                        "VECTOR": "Vector Map"
                    },
                    "extra": {
                        "EXTRA": "Extras",
                        "MAILBOX": "Mailbox",
                        "TIMELINE": "Timeline",
                        "CALENDAR": "Calendar",
                        "INVOICE": "Invoice",
                        "SEARCH": "Search",
                        "TODO": "Todo List",
                        "PROFILE": "Profile"
                    },
                    "pages": {
                        "PAGES": "Pages",
                        "LOGIN": "Login",
                        "REGISTER": "Register",
                        "RECOVER": "Recover password",
                        "PROFILE": "Profile",
                        "LOCK": "Lock",
                        "STARTER": "Starter Template"
                    }
                }
            }
        };

    }
})();
