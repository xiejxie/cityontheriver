/// PRESENTATION SIZES OF CHART
var nav_width = 150;
var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = window.innerWidth  - margin.left - nav_width
            //2650
    //2040
        - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;



// CHART_CONTAINER
// Contains the view that the user looks at and helps navigate the larger chart (in theory)
// Initial: set such that the view is constraited by the height and the width of the browser
var id_yaxis_svg = "yaxis_svg"; // ID for svg containing y-axis
var id_chart_svg = "chart_svg"; // ID for svg containing main chart
var window_width = window.innerWidth || document.documentElement.clientWidth;
var window_height = window.innerHeight || document.documentElement.clientheight;
var chart_container = d3.select("#chart_container")
    .style("width", (window_width - margin.right - nav_width + 15) + "px")
    .style("height", (window_height - margin.bottom) + "px");

// MAIN VIEW SVGs
// SVG that contains chart
var svg = chart_container
    .append("svg").attr("id", id_chart_svg)
    .attr("x",0).attr("y",0)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")scale(1)");
// SVG that contains y-axis
var yaxis_svg = d3.select("#yaxis_container").append("svg")
    .attr("x",0)
    .attr("y",0)
    .attr("id", id_yaxis_svg)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")scale(1)");


// VARIOUS SETTINGS FOR MAIN CHART
var iconpadding = 4; // Padding between icon and node (which contains the icon)
var nodepadding = 2; // Padding between nodes
var products = {width: width, height: height/2}; // Product chart height and width
var collabs = {width: width, height:height/2, yOffset: products.height}; // Collab chart height and width
var num_breath = 7; // Number of bins (or breaths)
var linkWidth = 3; // Width of links between nodes
var nodeWidth = 19; // Width of node
var sizes = [height/2, height/2, width]; // width for diagram, (suggested) height for
                                         // prod, height for collab
var disp_w = 2, prod_h = 0, coll_h = 1;

// ----------------- //
// SANKEY LOADING... //
// ----------------- //
// Set up sankey object
var sankey = d3.sankey()
    .num_breath(num_breath)
    .nodeWidth(nodeWidth)
    .nodePadding(nodepadding)
    .linkWidth(linkWidth)
    .size(sizes);

//////////////////////////////////////////////////////////////////////////////////////////////
//    __                _ _               _         _   _               _                   //
//   /__\ ___  __ _  __| (_)_ __   __ _  (_)_ __   | |_| |__   ___     (_)___  ___  _ __    //
//  / \/// _ \/ _` |/ _` | | '_ \ / _` | | | '_ \  | __| '_ \ / _ \    | / __|/ _ \| '_ \   //
// / _  \  __/ (_| | (_| | | | | | (_| | | | | | | | |_| | | |  __/  _ | \__ \ (_) | | | |  //
// \/ \_/\___|\__,_|\__,_|_|_| |_|\__, | |_|_| |_|  \__|_| |_|\___| (_)/ |___/\___/|_| |_|  //
//                                |___/                              |__/                   //
//                                                                                          //
//////////////////////////////////////////////////////////////////////////////////////////////
var sim = prompt("Please enter a decimal between 0 and 1 representing the similarity percentage.");
var queryString = prompt("Please enter a query string.")
$.ajax({
    type: "GET",
    crossDomain: true,
    url: "https://cityontheriver.pythonanywhere.com/?simPercentage="+sim+"&queryString="+queryString.replace(" ","%20"),
    async: false,
    success: function(data) {
      let energy = JSON.parse(data);
      console.log(energy.nodes)
      var start = (new Date()).getTime();

        // ----------------- //
        // SANKEY LOADING... //
        // ----------------- //
        // Seting in data that has been read-in
        sankey.nodes(energy.nodes)
            .links(energy.links)
            .people(energy.people)
            .collabs(energy.collabs)
            .legend(energy.legend)
            .membership(energy.membership)
            .do_smudge(true);

        // 1. Generate original layout and read data
        sankey.layout(window.innerHeight - margin.top - margin.bottom);

        var defs = svg.append("defs");

        // ------------- //
        // HL LOADING... //
        // ------------- //
        var hl = d3.hl()
            .set_file_name('hi')
            .id_yaxis_svg(id_yaxis_svg)
            .id_chart_svg(id_chart_svg)
            .defs(defs)
            .margin(margin)
            .sankey(sankey)
            .init_grid()
            .init_values(); // 2. Setup from hl

        // -------------- //
        // NAV LOADING... //
        // -------------- //
        var nav = d3.nav()
           .set_file_name('hi')
           .nav_width(nav_width)
           .defs(defs)
           .hl(hl);

        // Give access of nav functions to HL :/
        hl.hl_catcher(nav.hl_catcher)
          .nav_prod_resize(nav.nav_prod_resize);

        // 3. Finish setup with hl
        hl.setup_zooming();
        hl.setup_canvas();
        hl.initualize();

        // 4. Set-up navigation
        nav.setup();
        nav.nav_prod_resize(hl.width_0());
        window.scrollTo(0, window.scrollY);

        hl.printout("HL", "START", true, true);
        nav.printout("NAV", "START", true, true);

      console.log("FINAL:", (new Date()).getTime() - start);
      },
    error: function(request, status, error) {
      console.log("check")
      console.log(request)
      console.log(status)
      console.log("Error: " + error)
    }
});
