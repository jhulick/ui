
/**
 * @ngdoc service
 * @name dataservice
 * @description
 *     Application data API.
 */
(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('dataservice', dataservice);

    dataservice.$inject = ['$http', '$location', '$q', 'exception', 'logger'];

    /**
     * @ngdoc method
     * @name dataservice#dataservice
     * @description
     *     Configures the dataservice.
     * @param  {[type]} $http
     * @param  {[type]} $location
     * @param  {[type]} $q
     * @param  {[type]} exception
     * @param  {[type]} logger
     * @return {Object} dataservice service
     */
    /* @ngInject */
    function dataservice($http, $location, $q, exception, logger) {
        var isPrimed = false;
        var primePromise;

        var service = {
            getCustomersCast: getCustomersCast,
            getPeople: getPeople,
            getCities: getCities,
            getStates: getStates,
            getCustomerCount: getCustomerCount,
            getPeopleCount: getPeopleCount,
            getCustomers: getCustomers,
            getMessageCount: getMessageCount,
            getGridData: getGridData,
            ready: ready
        };

        return service;

        //================================================================

        function getMessageCount() { return $q.when(72); }

        function getCustomers() {
            return $http.get('/api/maa')
                .then(getCustomersComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCustomers')(message);
                    $location.url('/');
                });

            function getCustomersComplete(data, status, headers, config) {
                return data.data[0].data.results;
            }
        }

        function getCities() {
            return $http.get('/api/cities')
                .then(getCitiesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getCities')(message);
                    $location.url('/');
                });

            function getCitiesComplete(data, status, headers, config) {
                return data.data[0].data.results;
            }
        }

        function getStates() {
            return $http.get('/api/states')
                .then(getStatesComplete)
                .catch(function(message) {
                    exception.catcher('XHR Failed for getStates')(message);
                    $location.url('/');
                });

            function getStatesComplete(data, status, headers, config) {
                return data.data[0].data.results;
            }
        }

        function getCustomerCount() {
            var count = 0;
            return getCustomersCast()
                .then(getCustomersCastComplete)
                .catch(exception.catcher('XHR Failed for getCustomerCount'));

            function getCustomersCastComplete (data) {
                count = data.length;
                return $q.when(count);
            }
        }

        function getCustomersQuery() {
            var query = breeze.EntityQuery
                .from("Customers")
                .toType("Customer")
                .using(manager);
            return query;
        }

        function getPeopleCount() {
            var count = 0;
            return getPeople()
                .then(getPeopleComplete)
                .catch(exception.catcher('XHR Failed for getPeopleCount'));

            function getPeopleComplete (data) {
                count = data.length;
                return $q.when(count);
            }
        }

        function getCustomersCast() {

            var cast = [
                {name: 'Robert Downey Jr.', character: 'Tony Stark / Iron Man'},
                {name: 'Chris Hemsworth', character: 'Thor'},
                {name: 'Chris Evans', character: 'Steve Rogers / Captain America'},
                {name: 'Mark Ruffalo', character: 'Bruce Banner / The Hulk'},
                {name: 'Scarlett Johansson', character: 'Natasha Romanoff / Black Widow'},
                {name: 'Jeremy Renner', character: 'Clint Barton / Hawkeye'},
                {name: 'Gwyneth Paltrow', character: 'Pepper Potts'},
                {name: 'Samuel L. Jackson', character: 'Nick Fury'},
                {name: 'Paul Bettany', character: 'Jarvis'},
                {name: 'Tom Hiddleston', character: 'Loki'},
                {name: 'Clark Gregg', character: 'Agent Phil Coulson'}
            ];
            return $q.when(cast);
        }

        function getPeople() {

            var people = [
                { firstName: 'Ida', lastName: 'Black', agency: 'OMB', deanDiddy: "yes" },
                { firstName: 'Norma', lastName: 'Burke', agency: 'OMB', deanDiddy: "yes" },
                { firstName: 'Curtis', lastName: 'Stevens', agency: 'OMB', deanDiddy: "yes" },
                { firstName: 'Max', lastName: 'Douglas', agency: 'OMB', deanDiddy: "yes" },
                { firstName: 'Joann', lastName: 'Morgan', agency: 'OMB', deanDiddy: "yes" },
                { firstName: 'Emily', lastName: 'Henderson', agency: 'OMB', deanDiddy: "yes" },
                { firstName: 'William', lastName: 'Watkins', agency: 'OMB', deanDiddy: "yes" }
            ];

            return $q.when(people);
        }

        function getGridData() {
            var data = [
                {
                    "id" : "2",
                    "Address" : "Adenauerallee 900",
                    "City" : "Stuttgart",
                    "CompanyName" : "Die Wandernde Kuh",
                    "ContactName" : "Rita Müller",
                    "ContactTitle" : "Sales Representative",
                    "Country" : "Germany",
                    "CustomerID" : "729de505-ea6d-4cdf-89f6-0360ad37bde7",
                    "CustomerID_OLD" : "WANDK",
                    "Fax" : "0711-035428",
                    "Phone" : "0711-020361",
                    "PostalCode" : "70563",
                    "Region" : null,
                    "RowVersion" : 2
                },
                {
                    "id" : "3",
                    "Address" : "Boulevard Tirou, 255",
                    "City" : "Charleroi",
                    "CompanyName" : "Suprêmes délices",
                    "ContactName" : "Pascale Cartrain",
                    "ContactTitle" : "Accounting Manager",
                    "Country" : "Belgium",
                    "CustomerID" : "cd98057f-b5c2-49f4-a235-05d155e636df",
                    "CustomerID_OLD" : "SUPRD",
                    "Fax" : "(071) 23 67 22 21",
                    "Phone" : "(071) 23 67 22 20",
                    "PostalCode" : "B-6000",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "id" : "4",
                    "Address" : "Via Monte Bianco 34",
                    "City" : "Torino",
                    "CompanyName" : "Franchi S.p.A.",
                    "ContactName" : "Paolo Accorti",
                    "ContactTitle" : "Sales Representative",
                    "Country" : "Italy",
                    "CustomerID" : "9d4d6598-b6c2-4b52-890b-0636b23ec85b",
                    "CustomerID_OLD" : "FRANS",
                    "Fax" : "011-4988261",
                    "Phone" : "011-4988260",
                    "PostalCode" : "10100",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "5",
                    "$type" : "Models.MaxPaaS.SPA.Customer",
                    "Address" : "Obere Str. 57",
                    "City" : "Berlin",
                    "CompanyName" : "Alfreds Futterkiste",
                    "ContactName" : "Maria K. Anders",
                    "ContactTitle" : "Sales Representative",
                    "Country" : "Germany",
                    "CustomerID" : "785efa04-cbf2-4dd7-a7de-083ee17b6ad2",
                    "CustomerID_OLD" : "ALFKI",
                    "Fax" : "030-0076545",
                    "Phone" : "030-0074321",
                    "PostalCode" : "12209",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "6",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Taucherstraße 10",
                    "City" : "Cunewalded",
                    "CompanyName" : "QUICK-Stop",
                    "ContactName" : "Horst Kloss",
                    "ContactTitle" : "Accounting Manager",
                    "Country" : "Germany",
                    "CustomerID" : "f0f2274d-4d5b-4dde-a560-08ceeed406e0",
                    "CustomerID_OLD" : "QUICK",
                    "Fax" : null,
                    "Phone" : "0372-035188",
                    "PostalCode" : "01307",
                    "Region" : null,
                    "RowVersion" : 1
                },
                {
                    "$id" : "7",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Hauptstr. 29",
                    "City" : "Bern",
                    "CompanyName" : "Chop-suey Chinese",
                    "ContactName" : "Yang Wang",
                    "ContactTitle" : "Owner",
                    "Country" : "Switzerland",
                    "CustomerID" : "eef42f9f-9d9d-4a38-96e8-0ad2200bccf0",
                    "CustomerID_OLD" : "CHOPS",
                    "Fax" : null,
                    "Phone" : "0452-076545",
                    "PostalCode" : "3012",
                    "Region" : null,
                    "RowVersion" : 2
                },
                {
                    "$id" : "8",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "184, chaussée de Tournai",
                    "City" : "Lille",
                    "CompanyName" : "Folies gourmandes",
                    "ContactName" : "Martine Rancé",
                    "ContactTitle" : "Assistant Sales Agent",
                    "Country" : "France",
                    "CustomerID" : "e2c2f3a9-8b0b-4931-b234-0ba7f9ab5143",
                    "CustomerID_OLD" : "FOLIG",
                    "Fax" : "20.16.10.17",
                    "Phone" : "20.16.10.16",
                    "PostalCode" : "59000",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "9",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Maubelstr. 90",
                    "City" : "Brandenburg",
                    "CompanyName" : "Königlich Essen",
                    "ContactName" : "Philip Cramer",
                    "ContactTitle" : "Sales Associate",
                    "Country" : "Germany",
                    "CustomerID" : "18346543-ae30-4b4b-a3ac-1212469f0049",
                    "CustomerID_OLD" : "KOENE",
                    "Fax" : null,
                    "Phone" : "0555-09876",
                    "PostalCode" : "14776",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "10",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "12, rue des Bouchers",
                    "City" : "Marseille",
                    "CompanyName" : "Bon app'",
                    "ContactName" : "Laurence Lebihan",
                    "ContactTitle" : "Owner",
                    "Country" : "France",
                    "CustomerID" : "2656afff-d8d3-4960-82cc-13d3b421aa03",
                    "CustomerID_OLD" : "BONAP",
                    "Fax" : "91.24.45.41",
                    "Phone" : "91.24.45.40",
                    "PostalCode" : "13008",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "11",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Mataderos  2312",
                    "City" : "México D.F.",
                    "CompanyName" : "Antonio Moreno Taquería",
                    "ContactName" : "Antonio Moreno",
                    "ContactTitle" : "Owner",
                    "Country" : "Mexico",
                    "CustomerID" : "b61cf396-206f-41a6-9766-168b5cbb8edd",
                    "CustomerID_OLD" : "ANTON",
                    "Fax" : null,
                    "Phone" : "(5) 555-3932",
                    "PostalCode" : "05023",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "12",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Vinbæltet 34",
                    "City" : "Kobenhavn",
                    "CompanyName" : "Simons bistro",
                    "ContactName" : "Jytte Petersen",
                    "ContactTitle" : "Owner",
                    "Country" : "Denmark",
                    "CustomerID" : "657d32bc-158c-4d11-ac49-18981ce1e205",
                    "CustomerID_OLD" : "SIMOB",
                    "Fax" : "31 13 35 57",
                    "Phone" : "31 12 34 56",
                    "PostalCode" : "1734",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "13",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Berliner Platz 43",
                    "City" : "München",
                    "CompanyName" : "Frankenversand",
                    "ContactName" : "Peter Franken",
                    "ContactTitle" : "Marketing Manager",
                    "Country" : "Germany",
                    "CustomerID" : "d1afd4eb-c8ed-48c9-99b6-194661a899af",
                    "CustomerID_OLD" : "FRANK",
                    "Fax" : "089-0877451",
                    "Phone" : "089-0877310",
                    "PostalCode" : "80805",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "14",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "87 Polk St. Suite 5",
                    "City" : "San Francisco",
                    "CompanyName" : "Let's Stop N Shop",
                    "ContactName" : "Jaime Yorres",
                    "ContactTitle" : "Owner",
                    "Country" : "USA",
                    "CustomerID" : "c228b5da-bb34-44ed-86ae-1ac1af73bc02",
                    "CustomerID_OLD" : "LETSS",
                    "Fax" : null,
                    "Phone" : "(415) 555-5938",
                    "PostalCode" : "94117",
                    "Region" : "CA",
                    "RowVersion" : 0
                },
                {
                    "$id" : "15",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Sierras de Granada 9993",
                    "City" : "México D.F.",
                    "CompanyName" : "Centro comercial Moctezuma",
                    "ContactName" : "Francisco Chang",
                    "ContactTitle" : "Marketing Manager",
                    "Country" : "Mexico",
                    "CustomerID" : "30d3f75e-3863-433f-92dc-1dd6b3e3d845",
                    "CustomerID_OLD" : "CENTC",
                    "Fax" : "(5) 555-7293",
                    "Phone" : "(5) 555-3392",
                    "PostalCode" : "05022",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "16",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Strada Provinciale 124",
                    "City" : "Reggio Emilia",
                    "CompanyName" : "Reggiani Caseifici",
                    "ContactName" : "Maurizio Moroni",
                    "ContactTitle" : "Sales Associate",
                    "Country" : "Italy",
                    "CustomerID" : "7e3dd280-616f-4a80-857c-1ddad87082ef",
                    "CustomerID_OLD" : "REGGC",
                    "Fax" : "0522-556722",
                    "Phone" : "0522-556721",
                    "PostalCode" : "42100",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "17",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Rua do Mercado, 12",
                    "City" : "Resende",
                    "CompanyName" : "Wellington Importadora",
                    "ContactName" : "Paula Parente",
                    "ContactTitle" : "Sales Manager",
                    "Country" : "Brazil",
                    "CustomerID" : "e14083ed-3011-409b-a03a-1f8a3dfe85b4",
                    "CustomerID_OLD" : "WELLI",
                    "Fax" : null,
                    "Phone" : "(14) 555-8122",
                    "PostalCode" : "08737-363",
                    "Region" : "SP",
                    "RowVersion" : 0
                },
                {
                    "$id" : "18",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Estrada da saúde n. 58",
                    "City" : "Lisboa",
                    "CompanyName" : "Princesa Isabel Vinhos",
                    "ContactName" : "Isabel de Castro",
                    "ContactTitle" : "Sales Representative",
                    "Country" : "Portugal",
                    "CustomerID" : "39cd4c6e-cb16-4c28-ac72-27137fc9b7c5",
                    "CustomerID_OLD" : "PRINI",
                    "Fax" : null,
                    "Phone" : "(1) 356-5634",
                    "PostalCode" : "1756",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "19",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "2817 Milton Dr.",
                    "City" : "Albuquerque",
                    "CompanyName" : "Rattlesnake Canyon Grocery",
                    "ContactName" : "Paula Wilson",
                    "ContactTitle" : "Assistant Sales Representative",
                    "Country" : "USA",
                    "CustomerID" : "8681c215-653a-4df2-93e7-28d1ad3f74d8",
                    "CustomerID_OLD" : "RATTC",
                    "Fax" : "(505) 555-3620",
                    "Phone" : "(505) 555-5939",
                    "PostalCode" : "87110",
                    "Region" : "NM",
                    "RowVersion" : 0
                },
                {
                    "$id" : "20",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "5ª Ave. Los Palos Grandes",
                    "City" : "Caracas",
                    "CompanyName" : "GROSELLA-Restaurante",
                    "ContactName" : "Manuel Pereira",
                    "ContactTitle" : "Owner",
                    "Country" : "Venezuela",
                    "CustomerID" : "1dbda67d-c658-40f9-b210-29dc2d3a2dd2",
                    "CustomerID_OLD" : "GROSR",
                    "Fax" : "(2) 283-3397",
                    "Phone" : "(2) 283-2951",
                    "PostalCode" : "1081",
                    "Region" : "DF",
                    "RowVersion" : 0
                },
                {
                    "$id" : "21",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "55 Grizzly Peak Rd.",
                    "City" : "Butte",
                    "CompanyName" : "The Cracker Box",
                    "ContactName" : "Liu Wong",
                    "ContactTitle" : "Marketing Assistant",
                    "Country" : "USA",
                    "CustomerID" : "2b24bba4-df6b-4545-b8fb-2f8966d96f74",
                    "CustomerID_OLD" : "THECR",
                    "Fax" : "(406) 555-8083",
                    "Phone" : "(406) 555-5834",
                    "PostalCode" : "59801",
                    "Region" : "MT",
                    "RowVersion" : 0
                },
                {
                    "$id" : "22",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "ul. Filtrowa 68",
                    "City" : "Warszawa",
                    "CompanyName" : "Wolski Zajazd",
                    "ContactName" : "Zbyszek Piestrzeniewicz",
                    "ContactTitle" : "Owner",
                    "Country" : "Poland",
                    "CustomerID" : "a2ffbc41-55c1-432e-b33c-2ffb8b701588",
                    "CustomerID_OLD" : "WOLZA",
                    "Fax" : "(26) 642-7012",
                    "Phone" : "(26) 642-7012",
                    "PostalCode" : "01-012",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "23",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Ing. Gustavo Moncada 8585 Piso 20-A",
                    "City" : "Buenos Aires",
                    "CompanyName" : "Océano Atlántico Ltda.",
                    "ContactName" : "Yvonne Moncada",
                    "ContactTitle" : "Sales Agent",
                    "Country" : "Argentina",
                    "CustomerID" : "c2e88671-4988-4594-a16d-3440c0c15246",
                    "CustomerID_OLD" : "OCEAN",
                    "Fax" : "(1) 135-5535",
                    "Phone" : "(1) 135-5333",
                    "PostalCode" : "1010",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "24",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Torikatu 38",
                    "City" : "Oulu",
                    "CompanyName" : "Wartian Herkku",
                    "ContactName" : "Pirkko Koskitalo",
                    "ContactTitle" : "Accounting Manager",
                    "Country" : "Finland",
                    "CustomerID" : "fbcf888c-7ee3-4b00-980e-373ce8b7817d",
                    "CustomerID_OLD" : "WARTH",
                    "Fax" : "981-443655",
                    "Phone" : "981-443655",
                    "PostalCode" : "90110",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "25",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Via Ludovico il Moro 22",
                    "City" : "Bergamo",
                    "CompanyName" : "Magazzini Alimentari Riuniti",
                    "ContactName" : "Giovanni Rovelli",
                    "ContactTitle" : "Marketing Manager",
                    "Country" : "Italy",
                    "CustomerID" : "8b570cc3-3276-42e6-9876-3a9a2ffe9b97",
                    "CustomerID_OLD" : "MAGAA",
                    "Fax" : "035-640231",
                    "Phone" : "035-640230",
                    "PostalCode" : "24100",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "26",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Av. Copacabana, 267",
                    "City" : "Rio de Janeiro",
                    "CompanyName" : "Ricardo Adocicados",
                    "ContactName" : "Janete Limeira",
                    "ContactTitle" : "Assistant Sales Agent",
                    "Country" : "Brazil",
                    "CustomerID" : "9682aee1-543d-4f68-9d12-3bb93b65ad00",
                    "CustomerID_OLD" : "RICAR",
                    "Fax" : null,
                    "Phone" : "(21) 555-3412",
                    "PostalCode" : "02389-890",
                    "Region" : "RJ",
                    "RowVersion" : 0
                },
                {
                    "$id" : "27",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "24, place Kléber",
                    "City" : "Strasbourg",
                    "CompanyName" : "Blondesddsl père et fils",
                    "ContactName" : "Frédérique Citeaux",
                    "ContactTitle" : "Marketing Manager",
                    "Country" : "France",
                    "CustomerID" : "2477d007-f7f5-487e-945a-3dd466581813",
                    "CustomerID_OLD" : "BLONP",
                    "Fax" : "88.60.15.32",
                    "Phone" : "88.60.15.31",
                    "PostalCode" : "67000",
                    "Region" : "Sud",
                    "RowVersion" : 1
                },
                {
                    "$id" : "28",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "P.O. Box 555",
                    "City" : "Lander",
                    "CompanyName" : "Split Rail Beer & Ale",
                    "ContactName" : "Art Braunschweiger",
                    "ContactTitle" : "Sales Manager",
                    "Country" : "USA",
                    "CustomerID" : "d45ca70d-466c-4bbe-be5b-466e44c7189d",
                    "CustomerID_OLD" : "SPLIR",
                    "Fax" : "(307) 555-6525",
                    "Phone" : "(307) 555-4680",
                    "PostalCode" : "82520",
                    "Region" : "WY",
                    "RowVersion" : 0
                },
                {
                    "$id" : "29",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "722 DaVinci Blvd.",
                    "City" : "Kirkland",
                    "CompanyName" : "Trail's Head Gourmet Provisioners",
                    "ContactName" : "Helvetius Nagy",
                    "ContactTitle" : "Sales Associate",
                    "Country" : "USA",
                    "CustomerID" : "e9106364-b5da-4821-af56-46b40ad516c5",
                    "CustomerID_OLD" : "TRAIH",
                    "Fax" : "(206) 555-2174",
                    "Phone" : "(206) 555-8257",
                    "PostalCode" : "98034",
                    "Region" : "WA",
                    "RowVersion" : 0
                },
                {
                    "$id" : "30",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "Jardim das rosas n. 32",
                    "City" : "Lisboa",
                    "CompanyName" : "Furia Bacalhau e Frutos do Mar",
                    "ContactName" : "Lino Rodriguez",
                    "ContactTitle" : "Sales Manager",
                    "Country" : "Portugal",
                    "CustomerID" : "e4d3273f-5832-4ed2-bc7c-4ce623711c43",
                    "CustomerID_OLD" : "FURIB",
                    "Fax" : "(1) 354-2535",
                    "Phone" : "(1) 354-2534",
                    "PostalCode" : "1675",
                    "Region" : null,
                    "RowVersion" : 0
                },
                {
                    "$id" : "31",
                    "$type" : "Models.MaxPaaS.SPA.Customer, Model_NorthwindIB_NH",
                    "Address" : "City Center Plaza 516 Main St.",
                    "City" : "Elgin",
                    "CompanyName" : "Hungry Coyote Import Store",
                    "ContactName" : "Yoshi Latimer",
                    "ContactTitle" : "Sales Representative",
                    "Country" : "USA",
                    "CustomerID" : "5249d1f9-8699-4500-98b3-4dbaa6d4edb3",
                    "CustomerID_OLD" : "HUNGC",
                    "Fax" : "(503) 555-2376",
                    "Phone" : "(503) 555-6874",
                    "PostalCode" : "97827",
                    "Region" : "OR",
                    "RowVersion" : 0
                }
            ];

            return data;
        }

        function prime() {
            // This function can only be called once.
            if (primePromise) {
                return primePromise;
            }

            primePromise = $q.when(true).then(success);
            return primePromise;

            function success() {
                isPrimed = true;
                logger.info('Primed data');
            }
        }

        function ready(nextPromises) {
            var readyPromise = primePromise || prime();

            return readyPromise
                .then(function() { return $q.all(nextPromises); })
                .catch(exception.catcher('"ready" function failed'));
        }

    }
})();
