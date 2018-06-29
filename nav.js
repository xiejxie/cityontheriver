d3.nav = function () {

  // Original variables put into the system
  var nav = {},
    defs = d3.select("defs"),
    product_colour = "#c5941c",
    hl = d3.hl()
  ;
  // Clone code
  var disp_w = 2, prod_h = 0, coll_h = 1;

  // GENERAL
  var file_name = "name";
  nav.set_file_name = function(name) {
	file_name = name;
	return nav;
  }

  // Text for headings
  var header_text = ["Navigation", "Controls", "Change_Shading",/*"Explore",*/ "Manage_Nodes"]; // Main and sub-heading titles
  var change_stuff_text = ["Shade_Increments", "Node_Order"];
  var filter_text = ["In-Group", "Products", "Contributors", "People"]; // Heading under Manage_Nodes
  var controls_titles = ["Highlight_Chart","No_Highlights", "Restart_Sizes", /*"Move_down",*/ "Show_All", "Remove_All"];
  var options_titles = ["Highlight", "Filter"];


  // MANAGE NODES
  // Arrays for filters (under Manage Nodes)
  var filters_teamness = [];
  var filters_products = [];
  var filters_collabs = [];
  var filters_people = [];
  var filters_datasets = [filters_teamness, filters_products, filters_collabs,
                          filters_people];

  // And / Or situation
  var MODE = 2;
  var modes_text = ["New", "Or", "And"];//, "Subtract"];
  var modes_class = "modes_class";

  // META SETTINGS
  var REMOVE_SET0 = false;
  var REMOVE_SET1 = true; // ... For the purpose of the study
  var setting_highlighted = "click";
  var setting_highlighted_preview = "mouseover";
  var setting_highlighted_preview_off = "mouseout";
  var nav_width = 150;
  var DUMP = false;
//	 = true;


  // CHANGE SHADING
  // Sliders for changing the shading
  var prod_slider_scale = d3.scale.log() // Products
    .range([0,1])
    .domain([1,20]);
  var coll_slider_scale = d3.scale.linear() // Links between products
    .range([0.001,.5])
    .domain([1,20]);

  // SET/GET FUNCTIONS
  nav.defs = function (_) {
    if (!arguments.length) return defs;
    defs = _;
    return nav;
  };
  nav.hl = function (_) {
    if (!arguments.length) return hl;
    hl = _;
    product_colour = hl.product_colour();
    return nav;
  };
  nav.nav_width = function (_) {
    if (!arguments.length) return nav_width;
    nav_width = _;
    return nav;
  };


  // Other variables (for convienence)
  var nav_panel = d3.select("#nav"),
      icon_dim;

// ███████╗██╗   ██╗███╗   ██╗ ██████╗████████╗██╗ ██████╗ ███╗   ██╗███████╗
// ██╔════╝██║   ██║████╗  ██║██╔════╝╚══██╔══╝██║██╔═══██╗████╗  ██║██╔════╝
// █████╗  ██║   ██║██╔██╗ ██║██║        ██║   ██║██║   ██║██╔██╗ ██║███████╗
// ██╔══╝  ██║   ██║██║╚██╗██║██║        ██║   ██║██║   ██║██║╚██╗██║╚════██║
// ██║     ╚██████╔╝██║ ╚████║╚██████╗   ██║   ██║╚██████╔╝██║ ╚████║███████║
// ╚═╝      ╚═════╝ ╚═╝  ╚═══╝ ╚═════╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚══════╝

  // +-+-+-+-+-+
  // |S|e|t|u|p|
  // +-+-+-+-+-+
  // Adds spans to text to make it shorter for the space allowed
  function fix_widths_text() {

    function addElipses(parentNode, fullname) {
      d3.select(parentNode)
        .append("span")
        .attr("class","elipses")
        .attr("title", fullname)
        .text("...");
    }

    var texts = d3.selectAll("td .laconic span.span_text");
    texts[0].forEach(function(text, tindex) {

      var fullname = d3.select(text.parentNode).datum().fullname;

      // See if we can add the original text back
      if (fullname != text.textContent) {

        d3.select(text.parentNode).select(".elipses").remove();
        while (text.parentNode.scrollHeight <= 20 && fullname != text.textContent) {
          text.textContent += fullname.substring(text.textContent.length, text.textContent.length+1);
        }
      }

      // Reduce the text if necessary. If parent node scrollHeight > 20 then we know text
      //  is being moved down
      if (text.parentNode.scrollHeight > 20) {
        addElipses(text.parentNode, fullname);
        while (text.parentNode.scrollHeight > 20) {
          var string = text.textContent;
          text.textContent = string.substring(0, string.length - 1);
        }
      }

      if (text.textContent == fullname)
        d3.select(text.parentNode)
         .on(setting_highlighted_preview, null)
         .on(setting_highlighted_preview_off, null);
      else
        d3.select(text.parentNode)
         .on(setting_highlighted_preview, function (d) {
           hl.move_title_box(d3.event, fullname, "info2"); })
         .on(setting_highlighted_preview_off, hl.hide_title_box);
    });
  }
  nav.setup = function() {

    // Resize body of html page if the navigation goes to far (outside the <body>)
    function resize_body_nav() {

       d3.select("body")
          .style("width", parseInt(nav_panel.style("left")) + parseInt(nav_panel.style("width")) + "px")
          .style("height", parseInt(nav_panel.style("top")) + nav_panel.property("offsetHeight"));

    }

    // Set up headers so that clicking on them collapses the section below it
    function setup_header_collapse() {
      d3.selectAll(".header")
        .attr("title","Collapse")
        .on("click", function(d) {
          console.log("CLICK");
          var m = nav_panel.select("#" + d);
          var isVis = (m.style("display") == "block");
          if (isVis) {
            m.style("display", "none");
            d3.select(this)
              .style("border-bottom","5px solid white")
              .attr("title","Expand");
          } else {
            m.style("display", "block");
            d3.select(this)
              .style("border","none")
              .attr("title","Collapse");
            fix_widths_text();
          }
          var key = [(isVis) ? "Collapse>" : "Expand>"];
          key.push(d);
          nav.printout("NAV:setup_header_collaspse", key.join(""), false, true, false);
      })/*
      .on(setting_highlighted_preview, function(d) {
        var isVis = (nav_panel.select("#" + d).style("display") == "block");
        var string_info = (isVis) ? "Collapse" : "Expand";
        hl.move_title_box(d3.event, "<p><strong>Click to " + string_info + "</strong></p>", "help");
      })
      .on(setting_highlighted_preview_off, function() {
        hl.hide_title_box();
      })*/
      ;
    }

    // Set up variables
    function initalize_values() {

      nav_panel = d3.select("#nav");
      icon_dim = 15;
      var spot_colour = "rgb(128, 128, 140)";
      var spot_attribute = "background-color";

      // Locks the navigation to the left margin
      function lock_nav() {

        // Fix elements within panel
        nav_panel
          .attr("class","nav_sticky")
          .style("width", nav_width + "px")
          .style("background-color", "rgb(178, 178, 210)");
        ;

        fix_widths_text();

        // Move Charts & y-axis & Canvases to the right
        d3.select("#yaxis_svg")
          .style("left", nav_width + "px");
        d3.select("#chart_container")
          .style("left", nav_width + "px");

        // Resize Chart
        /*
        sankey.size()[disp_w] = sankey.size()[disp_w] - nav_width;
        sankey.rebreath();
        hl.draw_graph_resize(false);*/

      }

      function unlock_nav() {

        // Fix elements within panel
        nav_panel
          .attr("class","nav_floating")
          .style("width", 220 + "px")
        ;

        fix_widths_text();

        // Move Charts & y-axis & Canvases to the right
        d3.select("#yaxis_svg")
          .style("left", 0 + "px");
        d3.select("#chart_container")
          .style("left", 0 + "px");

      }

      // Add mechanism for dragging the navigation
      nav_panel.select("img#move")
          .data([1])
          .call(d3.behavior.drag()
          .on("dragstart", function(d) {
              d3.select(this)
                .attr("dragstart-x", d3.mouse(this)[0])
                .attr("dragstart-y", d3.mouse(this)[1]);
          })
          .on("drag", function(d) {

            // Based on http://jsfiddle.net/kU8Fm/1/

            var movex = parseInt(nav_panel.style("left"));
            var movey = parseInt(nav_panel.style("top"));

            //var m = d3.mouse(this);
            movex += d3.mouse(this)[0] - d3.select(this).attr("dragstart-x");
            movey += d3.mouse(this)[1] - d3.select(this).attr("dragstart-y");

            movey = Math.max(movey, 0);
            movex = Math.max(movex, 0);

            if (d3.select(this.parentNode).attr("class") == "nav_sticky") {
              movey += window.scrollY;
              movex += window.scrollX;
            }

            nav_panel
              .style("top", movey + "px")
              .style("left", movex + "px");

            if (d3.select(this.parentNode).attr("class") != "nav_sticky" && movex < window.scrollX + hl.margin().left)
              d3.select(this.parentNode).style(spot_attribute, spot_colour);
            else d3.select(this.parentNode).style(spot_attribute,"white");



          })
          .on("dragend", function(d) {
              d3.select(this)
                .attr("dragstart-x","")
                .attr("dragstart-y","");

            //console.log("END:", d3.select(this.parentNode).style(spot_attribute), spot_colour);
            var should_lock = (spot_colour == d3.select(this.parentNode).style(spot_attribute));
            if (should_lock)
              lock_nav();
            else {
              unlock_nav();
              resize_body_nav();
            }


          var key = (should_lock) ? "Locking" : "Unlocking>";
          nav.printout("NAV:nav_dragend", key, false, true, false);

          }))

      .on("click", function() {

       // console.log("DEBUGGER");
       // console.log("link_opacity_scale:", hl.link_opacity_scale().range(), sankey.max_collabs());
       // console.log("NUMBER OF LINKS:" , sankey.links().length);

      })
      ;


      // Adding headers
      d3.selectAll(".expandable")
        .data(header_text)
        .attr("id", function(d) { return d });

      // Adding expandable qualities
      d3.selectAll(".header")
        .data(header_text)
        .text(function (d) {
          return d.replace("_", " ") });

      lock_nav(); // Initialize nav in side
      hl.originally().width = sankey.size()[disp_w];

    }

    initalize_values();
    setup_controls();
    setup_filters();
    setup_shading();
    //setup_printout();


    setup_contextmenu();

    setup_header_collapse();
    resize_body_nav();
    check_filters(false); // init with browns filled
    sankey.filters_people(filters_people);

    return nav;
  }




  // +-+-+-+-+-+-+-+-+
  // |C|o|n|t|r|o|l|s|
  // +-+-+-+-+-+-+-+-+
  function Remove_All() {

    // Change underlying stucture (to de-select things)
    sankey.nodes().forEach(function (node) { node.filtered = true; });
    //sankey.links().forEach(function (link) { link.filtered = true; });
    //sankey.streams().forEach(function (stream) { stream.filtered = true; });
    sankey.people().forEach(function (person) { person.filtered = true; });


    filters_datasets.forEach(function (filter_dataset, dindex) {
      filter_dataset.forEach(function(filter_entry, eindex) { filter_entry.num_fl = filter_entry.num_total; });
    });
  }
  function No_Highlights() {

      // Change underlying stucture (to de-select things)
      sankey.nodes().forEach(function (node) { node.selected = false; });
      //sankey.links().forEach(function (link) { link.selected = false; });
      //sankey.streams().forEach(function (stream) { stream.selected = false; });
      sankey.people().forEach(function (person) { person.selected = false; });


    filters_datasets.forEach(function (filter_dataset, dindex) {
      filter_dataset.forEach(function(filter_entry, eindex) { filter_entry.num_hl = 0; });
    });
  }
  function Show_All() {

        // Change underlying stucture (to de-select things)
        sankey.nodes().forEach(function (node) { node.filtered = false; });
        //sankey.links().forEach(function (link) { link.filtered = false; });
        //sankey.streams().forEach(function (stream) { stream.filtered = false; });
        sankey.people().forEach(function (person) { person.filtered = false; });

        filters_datasets.forEach(function (filter_dataset, dindex) {
          filter_dataset.forEach(function(filter_entry, eindex) { filter_entry.num_fl = 0; });
        });

  }
  function All_Highlights() {


      // Change underlying stucture (to de-select things)
      sankey.nodes().forEach(function (node) { node.selected = true; });
      //sankey.links().forEach(function (link) { link.selected = false; });
      //sankey.streams().forEach(function (stream) { stream.selected = false; });
      //sankey.people().forEach(function (person) { person.selected = true; });


      filters_datasets.forEach(function (filter_dataset, dindex) {
        filter_dataset.forEach(function(filter_entry, eindex) { filter_entry.num_hl = filter_entry.num_total; });
      });
  }
  function setup_controls() {

      var sub_controls = d3.select("#Controls")
        //.style("height", (controls_titles.length + 2) * (15+2) + "px")
        .selectAll("p")
        .data(controls_titles)
        .enter()
        .append("p")
        .attr("class", "laconic clicker")
        .attr("id", function (d) { return d; })
        .style("width", 102 + "px")
        .text(function (d) { return d.replace("_"," "); });
      sub_controls.append("img")
        .attr("src",  function (d) { return "images/nav/" + d + ".png"});

    // Command functionality
    // Highlight what evers on the chart
    d3.select("#Highlight_Chart")
	.on("click", function () {

	sankey.nodes().forEach(function (node, nindex) {
		if (!node.filtered)
			node.selected;
	});

      // Change underlying stucture (to de-select things)
      sankey.nodes().forEach(function (node, nindex) {
	if (!node.filtered && !node.selected) {
		node.selected = true;
		update_counts (node, true, true);
        }
      });

        // Redraw
        hl.helper_de_highlight_prod_collab()
        sankey.sort_nodes();
        hl.move_prod_nodes();
        hl.move_prod_links();

        check_filters(true);
        nav.printout("NAV:setup_controls", "Controls>Highlight_Chart", true, false);
      })
	.on(setting_highlighted_preview, function (d) {
         	hl.move_title_box(d3.event, "Highlight products on chart", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box);
    // No_Highlights
    d3.select("#No_Highlights")
      .on("click", function () {

        No_Highlights();


        // Redraw
        hl.helper_de_highlight_prod_collab()
        sankey.sort_nodes();
        hl.move_prod_nodes();
        hl.move_prod_links();

        check_filters(true);
        nav.printout("NAV:setup_controls", "Controls>No_Highlights", true, false);
      })
	.on(setting_highlighted_preview, function (d) {
         	hl.move_title_box(d3.event, "Remove All Highlights", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box);
    // Show_All
    d3.select("#Show_All")
      .on("click", function () {

        Show_All();

        // Calculate & Redraw
        sankey.rebreath();
        hl.draw_graph_resize(true);

        check_filters(false);
        nav.printout("NAV:setup_controls", "Controls>Show_All", true, false);
      })
	.on(setting_highlighted_preview, function (d) {
         	hl.move_title_box(d3.event, "Show all products on Chart", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box);
    // Remove All
    d3.select("#Remove_All")
    .on("click", function () {

      Remove_All();

        // Calculate & Redraw
        sankey.rebreath();
        hl.draw_graph_resize(true);

      check_filters(false);
      nav.printout("NAV:setup_controls", "Controls>Remove_All", true, false);
    })
	.on(setting_highlighted_preview, function (d) {
         	hl.move_title_box(d3.event, "Remove All products from Chart", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box);
    // Restart
    d3.select("#Restart_Sizes")
    .on("click", hl.restart)
	.on(setting_highlighted_preview, function (d) {
         	hl.move_title_box(d3.event, "Restart Sizes (node height, chart width, time bin length)", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box);

    // Move down highlights
    /*
    d3.select("#Move_down")
    .on("click", function () {
            sankey.sort_nodes();
            hl.move_prod_nodes();
            hl.move_prod_links();
    });
    */

    // Fade others - not implemented
    d3.selectAll("#Controls img")
      .filter(function () { return (d3.select(this).datum().set == 1 && REMOVE_SET1)
        || (d3.select(this).datum().set == 0 && REMOVE_SET0) })
      .attr("title","Not functionable")
      .classed("clickable", false)
      .style("display","none")
      .on("click", function () {
        // do nothing;
      });

  }


    //  - - - - -   - - - -   - - - - - - - - -
    // |D|o|i|n|g| |w|i|t|h| |F|i|l|t|e|r|i|n|g|
    //  - - - - -   - - - -   - - - - - - - - -
    var node_type = function(node, pindex) { return node.type == pindex; }
    var node_coll = function(node, num) { return node.people.size() == num; }
    var node_team = function(node, team) {

      //console.log(team ? "in-group" : "out-group");

      // Regarding product projects
      if (team <= 1) {
        if (node.grps == 0)
          return false;
        if (team == 1 && node.in_grp > 0)
          return true;
        if (team == 0 && node.in_grp == 0)
          return true;
        return false;

        // Regarding team members
      } else {
        var sum = d3.sum(node.people.values(), function (person) { return person.groupness ? 1 : 0 });
        if (node.people.size() == 0)
          return false;
        if (team == 2 && sum == 0)
          return true;
        else if (team == 3 && sum == node.people.size())
          return true;
        else
          return false;
      }
    }
    var node_person = function (node, pindex) { return node.people.has("" + pindex); }
    var filt_functions = [node_team, node_type, node_coll, node_person];
    function update_counts (node, isHighlight, selected) {

      if (isHighlight) {
        filters_products[node.type].num_hl += (selected) ? 1 : -1;
        filters_collabs[node.people.size()].num_hl += (selected) ? 1 : -1;
        node.people.keys().forEach(function (person, pindex) { filters_people[person].num_hl += (selected) ? 1 : -1; });
      } else {
        filters_products[node.type].num_fl += (selected) ? 1 : -1;
        filters_collabs[node.people.size()].num_fl += (selected) ? 1 : -1;
        node.people.keys().forEach(function (person, pindex) { filters_people[person].num_fl += (selected) ? 1 : -1; });
      }
    }

    // +-+-+-+-+-+-+-+
    // |F|i|l|t|e|r|s|
    // +-+-+-+-+-+-+-+
    function setup_filters() {

      var setting_filter_add = "click";
      var setting_filter_remove = "contextmenu";


      // When pressing has no change, grey out option
      var grey_out_possibilities = function (isHighlight) {

  /*

        if (isHighlight || !arguments.length) {

          nav_panel.selectAll(".Highlight")
          .style("opacity", function (d) {
            return (MODE == modes_text.indexOf("New")
                    || ((MODE == modes_text.indexOf("Or"))
                        && filters_datasets[d.type][d.id].num_hl
                          < filters_datasets[d.type][d.id].num_total)
                    || ((MODE == modes_text.indexOf("And"))
                        && filters_datasets[d.type][d.id].num_hl > 0))
            ? 1 : 0.8
          });

       }
        if (!isHighlight || !arguments.length) {

          nav_panel.selectAll(".Filter")
          .style("opacity", function (d) {
            return (MODE == modes_text.indexOf("New")
                    || ((MODE == modes_text.indexOf("Or"))
                        && filters_datasets[d.type][d.id].num_fl
                          != 0)
                    || ((MODE == modes_text.indexOf("And"))
                        && filters_datasets[d.type][d.id].num_fl < filters_datasets[d.type][d.id].num_total
                       ))
            ? 1 : 0.5
          });

        }
*/
      }

    // Fitler away nodes that fit a criteria
    var filter_action =  function (ptype, pindex) {


          var isHighlight = (d3.select(this).datum().option == options_titles[0]) ? true : false;
          var isPeople = false;
          var filter_id = d3.select(this).datum().type;
          var filt_func = filt_functions[filter_id];
          var isAdd = (d3.event.type == setting_filter_add) ? true : false;

          // People filter
          if (filter_id == 3) {
            pindex = d3.select(this.parentNode).datum().name;
            isPeople = true;
          }

          // Navigation
          //var selected = toggle_icon(d3.select(this));
          //toggle_listing(this, isHighlight, selected);
          var selected = (isHighlight)
            ? ((isAdd) ? true : false)
          //  : ((isAdd) ? true : false);
            : ((isAdd) ? false : true);

          // #MODE REPLACE
          if (MODE == modes_text.indexOf("New")) {
            if (!isHighlight) {
              if (!selected)
                Remove_All();
              else
                Show_All();
            } else {
              if (selected)
                No_Highlights();
              else
                All_Highlights();
            }
            hl.helper_de_highlight_prod_collab();
          }

      //console.log("MODE:", modes_text[MODE], "isHighlight:", isHighlight, "\tisAdd:", isAdd, "\tselected:", selected);

          // Update underlying content
          // #MODE ADD
          if (MODE <= modes_text.indexOf("Or") || (!selected && isHighlight) || (selected && !isHighlight)) {

              // NODES
              sankey.nodes()
                .filter(function (node,nindex) { return filt_func(node, pindex); })
                .forEach(function (node, nindex) {
                  if (!isHighlight && node.filtered != selected) {
                    node.filtered = selected;
                    update_counts(node, isHighlight, selected);
                  } else if (isHighlight && node.selected != selected) {
                    node.selected = selected;
                    update_counts(node, isHighlight, selected);
                  }
              });
              // PEOPLE
              if (isPeople) {

                sankey.people()
                .filter(function (person, pid) { return pid == pindex })
                .forEach(function (person) {
                  if (!isHighlight && person.filtered != selected) {
                    person.filtered = selected;
                  } else if (isHighlight && person.selected != selected) {
                    person.selected = selected;
                  }
                });
              }
          }

          // MODE INTERSECT
          else if (MODE == modes_text.indexOf("And")) {

            sankey.nodes()
              .filter(function (node, nindex) { return (isHighlight) ? node.selected : !node.filtered; })
              .forEach(function (node, nindex) {
                if (!filt_func(node, pindex)) {
                  if (isHighlight) {// && node.selected) {
                    node.selected = false;
                    update_counts(node, isHighlight, !selected);
                  } else if (!isHighlight) { // && !node.filtered) {
                    node.filtered = true;
                    update_counts(node, isHighlight, !selected);
                  }
                }
              });
            // It really doesn't make sense to include people (intersections)
            // Might be better to just get rid of all people highlights
            /*
           if (isPeople) {
                sankey.people()
                .filter(function (person, pid) { return (isHighlight) ? person.selected : !person.filtered; })
                .forEach(function (person, pid) {
                  if (pid == pindex) {
                    if (isHighlight && person.selected) {
                        person.selected = false;
                    } else if (!isHighlight && !person.filtered) {
                        person.filtered = true;
                    }
                  }
                });
              }*/
          }

          // Update the canvas
          // FILTER
          if (!isHighlight) {

            // Links
            sankey.filter();
            hl.helper_create_gradients();
            hl.redraw_prod_links();

            // Streams
            hl.move_coll_streams();

            // Nodes
            hl.move_prod_nodes();

          // HIGHLIGHT
          } else if (isHighlight) {

            sankey.sort_nodes();
            hl.move_prod_nodes();
            hl.move_prod_links();

            // Nodes
            if (!isPeople || MODE == modes_text.indexOf("And"))
              hl.node_draw_simple();
            else //{
               hl.helper_de_highlight_prod_collab();
              /*
              if (selected) {
             //   sankey.streams()
             //     .filter(function (stream) { return stream.person == pindex; })
             //     .forEach(hl.helper_highlight_prod_collab);
            //    hl.helper_de_highlight_prod_collab(sankey.streams()[pindex], pindex);
            hl.helper_de_highlight_prod_collab();

              } else
                hl.helper_de_highlight_prod_collab();
            }
            */
          }

      check_filters(isHighlight);
      grey_out_possibilities(isHighlight);

      var key = [(isHighlight) ? "Highlight>" : "Filter>"];
      key.push((isAdd) ? "Add" : "Subtract");
      key.push(" (" + filter_text[filter_id] + ">");
      key.push(filters_datasets[filter_id][pindex].fullname + ")");
      nav.printout("NAV:filter_action", key.join(""), true, false);

    };

    // Adds buttons to each Manage Nodes to filter or highlight nodes
    var add_highlight_filter = function(part, type) {

      function getTitle(isHighlight, short_data) {
        //console.log(short_data);
        var datum = filters_datasets[short_data.type][short_data.id];
        var class_name = (isHighlight) ? "highlighted" : "included";
        var ofInterest = (isHighlight) ? datum.num_hl : datum.num_total - datum.num_fl;
        return "of which are " + class_name + ":<br>" + ofInterest + "/" + datum.num_total
          + " (<strong>" + Math.round(ofInterest/datum.num_total*1000)/10 + "%</strong>)";
      }

       part.append("td")
        .append("div")
       .datum(function (d,i) { return {type: type, option: options_titles[0], id:i} })
        .attr("class", "clicker " + options_titles[0])
        .on(setting_filter_remove, filter_action)
        .on(setting_filter_add, filter_action)
        .on(setting_highlighted_preview, function (d) {
         	hl.move_title_box(d3.event, getTitle(true, d), "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box)
        .append("div")
         .attr("class","fground");

      part.append("td")
        .append("div")
        .datum(function (d,i) { return {type: type, option: options_titles[1], id:i} })
        .attr("class", "clicker " + options_titles[1])
        .on(setting_filter_remove, filter_action)
        .on(setting_filter_add, filter_action)
        .on(setting_highlighted_preview, function (d) {
         hl.move_title_box(d3.event, getTitle(false, d), "info2"); })
         .on(setting_highlighted_preview_off, hl.hide_title_box)
         .append("div")
           .attr("class","fground");
      ;
    }


    function init_filters() {

    var mode_sizes = [40, 32, 40];
    var mode_container = d3.select("#" + header_text[3])
        .append("div")
        .selectAll("p." + modes_class)
        .data(modes_text)
        .enter()
        .append("p")
        .attr("class", "laconic clicker " + modes_class)
        .attr("id", function (d) { return d; })
        .style("width", function (d,i) { return mode_sizes[i] + "px"})
        .text(function (d) { return d; })
      .on("click", function () {
        nav_panel.selectAll("." + modes_class).classed("icon_sel", false);
        d3.select(this).classed("icon_sel", true);
        MODE = modes_text.indexOf(d3.select(this).datum());
        grey_out_possibilities();
        nav.printout("NAV:init_filters", "Mode>" + modes_text[MODE], false, false)
      })
    ;
      mode_container.append("img")
        .attr("src",  function (d) { return "images/nav/Mode" + d + ".png"});
      d3.select("#" + header_text[3] + " #" + modes_text[MODE]).classed("icon_sel", true);


    // Add sub-heading
    var filters_parts = d3.select("#" + header_text[3])
      .selectAll("div.modes")
      .data(filter_text)
      .enter()
      .append("div")
        .attr("class", "modes")
        .attr("id", function (d,i) { return "n" + i; });
    filters_parts.append("h3")
      .classed("header", true)
      .text(function (d) { return d });
    filters_parts.append("div")
      .classed("expandable", true)
      .attr("id", function (d) { return d });


    // Original data that goes into each filter
    // ========================================
    // Products (Type)
    sankey.legend().forEach(function (type, tindex) {
      filters_products.push({url:type.url, fullname:type.name, num_hl:0, num_fl:0, num_total:0}); });

    // Contributors (Number of)
    filters_collabs = d3.range(0, sankey.max_collabs()+1, 1);
    filters_collabs = filters_collabs.map(function (d) {
      var text = (d != 1) ? "people" : "person";
      return {name: d, fullname:d + " " + text, num_hl:0, num_fl:0, num_total:0};
    });

    // People (Individuals)
    filters_people = d3.range(0, sankey.people().length, 1);
    filters_people = filters_people.map(function (d) {
      return {name: d, fullname:sankey.people()[d].name, num_hl:0, num_fl:0, num_total:0}; });

    // save num_total for each filters...
    sankey.nodes().forEach(function (node, nindex) {
      filters_products[node.type].num_total++;
      filters_collabs[node.people.size()].num_total++;
      node.people.keys().forEach(function (person, pindex) { filters_people[person].num_total++; });
    });
    filters_datasets = [filters_teamness, filters_products, filters_collabs, filters_people];

    //filters_people.sort(function (a,b) {
    //  return sankey.people()[a.name].name.localeCompare(sankey.people()[b.name].name) });


    /* ======================= vvv ======================== */
      {

    // Filters
    // - Teamness
    filters_teamness = [{"name":"Product: Out-teams", "colour":hl.ogc().toString()},
       {"name":"Product: In-teams", "colour":hl.igc().toString()}, {"name":"Collabs: Out-teams",
       "colour": hl.colour_scales()[0].range()[1] + "," + hl.colour_scales()[1].range()[1]
         + "," + hl.colour_scales()[2].range()[1]},
       {"name":"Collabs: In-teams", "colour": hl.colour_scales()[0].range()[0]
         + "," + hl.colour_scales()[1].range()[0] + "," + hl.colour_scales()[2].range()[0]}];

    // - Teamness
    filters_teamness.forEach(function (d) { d.selected = false; });
    nav_panel.select("#" + filter_text[0] + " .disp_options")
      .selectAll(".icon")
      .data(filters_teamness)
      .enter()
        .append("span")
        .attr("class", "icon right clickable")
        .attr("title", function (d,i) { return d.name +" " +i; })
        .attr("id", function (d,i) { return "n" + i; })
        .style("background-color", function (d) { return "rgb(" + d.colour + ")";})
        .style("opacity", function (d,i) {
          return i <= 1 ? hl.area_opacity_scale().range()[0] : hl.link_opacity_scale().range()[0]})
        .on("click", filter_action);

    nav_panel.select("#Manage_Nodes #n0")
      .remove();
       // .on(setting_highlighted_preview, filter_hover)
       // .on(setting_highlighted_preview_off, filter_hover);

     // Get rid of team ness (not an issue for study)
    //nav_panel.select("#" + filter_text[0] )//.selectAll("p")
    //.filter(function (d, i) { return i < 2; })
    //.style("display", "none");
    }
     // filters_teamness = [[]];
    /* ======================== ^^^ ======================= */


    // PRODUCTS (BASED ON TYPE)
    // ------------------------
    var prod_table = nav_panel.select("#" + filter_text[1])
      .append("table");
    var prod_table_rows = prod_table.selectAll("tr")
        .data(filters_products)
        .enter()
        .append("tr")
        .attr("id", function (d, i) { return "n" + i; });
    var prod_tables_rows_td = prod_table_rows.append("td")
      .append("div")
      .attr("class","laconic");
    prod_tables_rows_td
      .append("span")
      .attr("class","span_text")
      .text(function (d) { return d.fullname; });
    prod_tables_rows_td
      .append("svg")
        .append("image")
        .attr("xlink:href", function(d) { return d.url });
    add_highlight_filter(prod_table_rows, 1);

//     // COLLABORATORS (BASED ON AMOUNT)
//     // -------------------------------
//     var coll_table = nav_panel.select("#" + filter_text[2])
//       .append("table");
//     var coll_table_rows = coll_table.selectAll("tr")
//       .data(filters_collabs)
//       .enter()
//       .append("tr")
//       .attr("id", function (d, i) { return "n" + i; });
//     coll_table_rows.append("td")
//       .append("div")
//       .attr("class","laconic")
//       .style("background-color", function (d,i) { return d3.hsl(product_colour).darker(hl.product_step()*i) })
//       .append("span")
//       .attr("class","span_text")
//       .text(function (d) { return d.fullname; });
//     add_highlight_filter(coll_table_rows, 2);
//     coll_table.selectAll("tr")
//       .style("display", function (d) { return sankey.collabs_count().has(d.name) ? "block" : "none"; })
//     //
//     // PEOPLE (SORTED ALPHABETICALLY)
//     // ------------------------------
// var filters_people_short = filters_people.filter(function (d) { return d.num_total > 1 });
// console.log("SHORT:", filters_people_short);
//
//     var peop_table = d3.select("#" + filter_text[3])
//       .append("table");
//     var peop_table_rows = peop_table.selectAll("tr")
//       .data(filters_people)//_short)
//       .enter()
//       .append("tr")
//       .attr("id", function (d) { return "n" + d.name; });
//     peop_table_rows.append("td")
//       .append("div")
//       .attr("class","laconic")
//       .style("background-color", function (d,i) { return d3.rgb(hl.people_colour()[d.name % hl.people_colour().length]); })
//       .append("span")
//       .attr("class","span_text")
//       .text(function(d) { return d.fullname });
//     add_highlight_filter(peop_table_rows, 3);

    fix_widths_text();


    }

      init_filters();

  }

    //  - - - - -   - - - -   - - - - - - - -
    // |D|o|i|n|g| |w|i|t|h| |T|o|g|g|l|i|n|g|
    //  - - - - -   - - - -   - - - - - - - -
    // Add icon_sel class to button or take it away
  /*
    function toggle_listing(part, isHighlight, selected) {

      //console.log("toggle_listing:", part, d3.select(part).datum());

      // Fix the listing
      var td_captured = d3.select(part.parentNode.parentNode).select("td .laconic");
      if (isHighlight)
        if (selected) td_captured.classed("text_hl", true);
        else td_captured.classed("text_hl", false);
      else
        if (selected) td_captured.classed("text_fl", true);
      else td_captured.classed("text_fl", false);
      fix_widths_text();
    }

    // Change the icon
    function toggle_icon(part) {

      //console.log("toggle_icon:", part, part[0]);

      if (!part.datum().setting) {
        part.classed("icon_sel",true);
        part.datum().setting = true;
      } else {
        part.classed("icon_sel",false);
        part.datum().setting = false;
      }
      return part.datum().setting;
    }
    */
    // Check if the other buttons become ineffective
    // CHANGED: now does the status of elements on the main chart
    function check_filters(isHighlight) {

      var class_name = (isHighlight) ? "Highlight" : "Filter";
      var text_class_name = (isHighlight) ? "text_hl" : "text_fl";

      // Does not work for filters_teamness (set f to 1)
      for (var f = 1; f < filters_datasets.length; f++) {

        var filters_containers = d3.selectAll("#" + filter_text[f] + " ." + class_name)[0];
        for (var d = 0; d < filters_containers.length; d++) {

          var datum = filters_datasets[d3.select(filters_containers[d]).datum().type][d];
          var ofInterest = (isHighlight) ? datum.num_hl : datum.num_total - datum.num_fl;
          var ofTotal = datum.num_total;//(isHighlight) ? (datum.num_total - datum.num_fl) : datum.num_total;
          var node_modify = d3.select("#Manage_Nodes #" + filter_text[f] + " tr#n" + d + " div." + class_name + " div.fground");
          var text_modify = d3.select("#Manage_Nodes #" + filter_text[f] + " tr#n" + d + " div.laconic");

          //console.log(ofInterest == datum.num_total, ofInterest, datum.fullname, " " + datum.num_hl + "-" + datum.num_fl + "/", datum.num_total);

          if ((ofInterest == datum.num_total && isHighlight)
               || (ofInterest == 0 && !isHighlight)) {
            //node_modify.style("background-image", "url(images/nav/" + class_name + "D.png");
            text_modify.classed(text_class_name, true);
          } else {
            //node_modify.style("background-image", "url(images/nav/" + class_name + "I.png");
            text_modify.classed(text_class_name, false);
          }
          //console.log(datum.fullname, ofInterest, ofTotal, ofInterest/ofTotal);
          node_modify
            .style("width", ofInterest/ofTotal*icon_dim + "px");

        }

      }
      fix_widths_text();

    }
    //  - - - - -   - - - -   - -
    // |D|o|i|n|g| |w|i|t|h| |h|l|
    //  - - - - -   - - - -   - -
    //sent to hl to catch things associated with highlighting there.
    nav.hl_catcher = function(partner) {

      var datum = d3.select(partner.node()).datum();
      var full_datum = d3.select(partner.node().parentNode.parentNode).datum();

      //if (!partner.datum().setting) {
      if (full_datum.num_hl != full_datum.num_total) {

        // Because highlighting is taken care of in hl...we just have to re-calculate
        //  the amount of nodes that fit each descriptor
        filters_datasets.forEach(function (filter_dataset, dindex) {
          filter_dataset.forEach(function(filter_entry, eindex) { filter_entry.num_hl = 0; });
        });
        sankey.nodes().forEach(function (node, nindex) {
          if (node.selected) {
            filters_products[node.type].num_hl++;
            filters_collabs[node.people.size()].num_hl++;
            node.people.keys().forEach(function (person, pindex) {
              if (person != full_datum.name) filters_people[person].num_hl++; });
          }
        });
        filters_people[full_datum.name].num_hl = filters_people[full_datum.name].num_total;

        //toggle_icon(partner);
        //toggle_listing(part, true, true);


        sankey.sort_nodes();
        hl.move_prod_nodes();
        hl.move_prod_links();
        //hl.move_coll_streams();


        check_filters(true);


        var key = ["Highlight>Add"];
      key.push(" (" + filter_text[3] + ">");
      key.push(filters_datasets[3][full_datum.name].fullname + ")");
      nav.printout("NAV:hl_catcher", key.join(""), true, false);
      }

    }
    nav.nav_prod_resize = function (size) {
      var space = icon_dim;
      size = Math.min(size, space);
      size = Math.max(size, 1);
      nav_panel.selectAll("#Products .laconic image")
        .attr("height", size + "px")
        .attr("width", size + "px")
        .attr("y", space/2 - size/2 + "px")
        .attr("x", space/2 - size/2 + "px")
      ;
    }


    // +-+-+-+-+-+-+-+
    // |S|h|a|d|i|n|g|
    // +-+-+-+-+-+-+-+
    function setup_shading() {

      function helper_build_structure() {

          // Add sub-heading
          var shading_parts = d3.select("#" + header_text[2])
            .selectAll("div.modes")
            .data(change_stuff_text)
            .enter()
            .append("div")
              .attr("class", "modes")
              .attr("id", function (d,i) { return "n" + i; })
          ;
          shading_parts.append("h3")
            .classed("header", true)
            .text(function (d) { return d.replace("_"," ") });
          shading_parts.append("div")
            .classed("expandable", true)
            .attr("id", function (d) { return d });

      // BUILD STRUCTURE
      // ---------------
      // BUILD STRUCTURE for shading increments
      var shading_ids = ["prod_incr_slider", "prod_incr", "collab_incr_slider", "collab_incr"];
      shading_parts.select("#" + change_stuff_text[0])
        .selectAll("p")
        .data(shading_ids)
        .enter()
        .append("p")
        .attr("id", function (d) { return d; })
        .attr("class", function (d,i) { return (i%2==0) ? "right clear" : ""; });
      // BUILD STRUCTURE for node order

      shading_parts.select("#" + change_stuff_text[1])
        .append("div")
        .attr("id", "sort_order");

      }
      function helper_build_incrs() {
        // - Change_Shading increments
        var nav_incr_count = sankey.max_collabs();
        var nav_collab_incr_id = "nav_collab_incr";

        // Create a gradient for the shading of links
        var nav_collab_incr = defs.append("linearGradient")
            .attr("gradientUnits","userSpaceOnUse") // need for straight lines stroke
            .attr("x1","0%")
            .attr("y1","0%")
            .attr("x2","0%")
            .attr("y2","100%")
            .attr("id", nav_collab_incr_id);
        nav_collab_incr.append("stop")
            .attr("offset","20%")
            .attr("stop-color", "rgb(" + hl.igc().toString() + ")");
        nav_collab_incr.append("stop")
            .attr("offset","80%")
            .attr("stop-color", "rgb(" + hl.igc().toString() + ")");

       var disp_width = Math.min(icon_dim, icon_dim*7/nav_incr_count);


        var nav_collab_incr_var = nav_panel.select("#collab_incr")
            .append("svg")
            .attr("width", disp_width * nav_incr_count)
            .attr("height", icon_dim + "px")

        // DRAW SQUARES
        for (var i = 0; i < nav_incr_count; i++) {

            // Slider for Product
            nav_panel.select("#prod_incr")
                .append("span")
                .style("display","block")
                .style("height", icon_dim + "px")
                .style("float","right")
                .style("width",disp_width + "px")
                .style("margin-left",0)
                .style("background-color", d3.hsl(product_colour).darker(hl.product_step()*(i+1)));

            // Slider for Collab
            nav_collab_incr_var.append("rect")
                .attr("width", disp_width + "px")
                .attr("height", icon_dim + "px")
                .attr("x", disp_width * (nav_incr_count - i-1))
                .attr("fill", "url(#" + nav_collab_incr_id + ")")
                .attr("opacity", hl.link_opacity_scale().range()[0] * (i+1));
        }

        // SLIDER FOR PRODUCT
        nav_panel.select("#prod_incr_slider")
            .append("input")
            .attr("type","range")
            .attr("min",prod_slider_scale.domain()[0])
            .attr("max",prod_slider_scale.domain()[1])
            .style("height",5 + "px")
            .style("width",55 + "px")
            .style("cursor","ew-resize")
            .attr("value", prod_slider_scale.invert(hl.product_step()))
        .on("input", function () {
          hl.product_step(prod_slider_scale(this.value));

          // Fix controls: shadings
          nav_panel.selectAll("#prod_incr span")
            .style("background-color", function(d,i) { return d3.hsl(product_colour).darker(hl.product_step()*i)});
          // Fix controls: filter
          nav_panel.selectAll("#" + filter_text[2] + " td:first-child div")
            .style("background-color", function (d,i) { return d3.hsl(product_colour).darker(hl.product_step()*(i)) });
          // Nodes
          d3.selectAll(".node rect")
            .attr("fill", hl.sort_out_node_fill)
            .style("stroke", hl.sort_out_node_stroke);
          nav.printout("NAV:setup_shading", "Shading>Nodes (" + hl.product_step() + ")",
                   false, false);
        })
        .on(setting_highlighted_preview, function (d) {
         hl.move_title_box(d3.event, "Modify Product Shading", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box)
        ;

        // SLIDER FOR COLLAB LINKS
        nav_panel.select("#collab_incr_slider")
            .append("input")
            .attr("type","range")
            .attr("min",coll_slider_scale.domain()[0])
            .attr("max",coll_slider_scale.domain()[1])
            .style("height",5 + "px")
            .style("width",55 + "px")
            .style("cursor","ew-resize")
            .attr("value", hl.link_opacity_scale().range()[0])
         .on("input", function () {
           hl.link_opacity_scale().range()[0] = coll_slider_scale(this.value);

          // Fix controls: shadings
          nav_collab_incr_var.selectAll("rect")
            .attr("opacity", function (d,i) { return hl.link_opacity_scale().range()[0] * (i+1)});

           // Links
           if (hl.use_canvas()) {
             d3.selectAll("canvas.canvas_person_id_")
             .style("opacity", function (d,i) {
               return sankey.people()[i].selected ? hl.link_opacity_scale().range()[1] : hl.link_opacity_scale().range()[0];
             });
           } else {
            d3.selectAll(".products .link")
            .style("stroke-opacity", function (d,i) {
              return (sankey.people()[i].selected)
                ? hl.link_opacity_scale().range()[1]
                : hl.link_opacity_scale().range()[0];
            });
           }
          nav.printout("NAV:setup_shading", "Shading>Links (" + hl.link_opacity_scale().range()[0] + ")",
                   false, false);
        })
        .on(setting_highlighted_preview, function (d) {
         hl.move_title_box(d3.event, "Modify Link Shading", "info2"); })
        .on(setting_highlighted_preview_off, hl.hide_title_box)
        ;
      }
      function helper_build_sort() {

          // SORT THING
          var sort_options = ["Date", "Highlights", "#Contribs", "Combos", "Type", "Name"];
          var sort_options_title = ["Published Date", "Highlighted products",
                                    "Number of contributors", "Combination of people",
                                    "Type of product", "Name of product"];
          var line_height = 20;

         nav_panel.select("#sort_order")
            .style("height", sort_options.length * (line_height+2) + "px")
            .selectAll("p.clicker")
            .data(sort_options)
            .enter()
            .append("p")
            .attr("id", function (d,i) { return "s" + i; })
            .style("top", function (d,i) { return i * line_height + "px"; })
            .attr("class", function (d,i) {return (i==0) ? "clicker" : "clicker strikeout"; })
            .on(setting_highlighted_preview, function (d,i) {
               hl.move_title_box(d3.event, "Sort by " + sort_options_title[i], "info2"); })
            .on(setting_highlighted_preview_off, hl.hide_title_box)
            .html(function (d,i) { return "<span id=\"" + d
              + "\">" + (i+1) + "</span>. " + d; })// + " " + i; })
            .on("click", function () {

              var selected_button = d3.select(this);
              var old_index = parseInt(selected_button.style("top"))/line_height;

              //console.log("ADDING: ", d3.select(this).select("span").attr("id"));
              sankey.add_order(sort_options.indexOf(d3.select(this).select("span").attr("id")));

                for (var sindex = old_index-1; sindex >= 0; sindex--) {

                  nav_panel.select("#sort_order").select("#s" + sindex)
                    .style("top", (sindex + 1) * line_height + "px")
                    .attr("id", "s" + (sindex + 1))
                    .select("span")
                    .text(sindex+2)
                  ;
                }
                selected_button
                  .style("top", 0)
                  .attr("id", "s0")
                  .attr("class", "clicker")
                  .select("span")
                  .text(1);


              sankey.sort_nodes();
              hl.move_prod_nodes();
              hl.move_prod_links();

		nav.printout("NAV:setup_controls", "Change_Shading>Node_order (ADD: " + d3.select(this).datum() + ")", false, false);
            })
            .on("contextmenu", function () {
              var selected_button = d3.select(this);

              var old_index = parseInt(selected_button.style("top"))/line_height;
              var first_strikout = nav_panel.select("#sort_order").select(".strikeout");
              var til_index = (first_strikout.node() != null)
                ? parseInt(first_strikout.style("top"))/line_height
                : sort_options.length;

              if (old_index < til_index) {

                 sankey.remove_order(sort_options.indexOf(d3.select(this).select("span").attr("id")));

                for (old_index = old_index+1; old_index < til_index; old_index++)
                  nav_panel.select("#sort_order").select("#s" + old_index)
                    .style("top", (old_index - 1) * line_height + "px")
                    .attr("id", "s" + (old_index - 1))
                    .select("span")
                    .text(old_index);
                til_index--;
                selected_button
                  .style("top", til_index * line_height + "px")
                  .attr("id", "s" + til_index)
                  .attr("class", "strikeout clicker")
                  .select("span")
                  .text(til_index+1);


                 sankey.sort_nodes();
                hl.move_prod_nodes();
                hl.move_prod_links();
              }
		nav.printout("NAV:setup_controls", "Change_Shading>Node_order (REMOVE: " + d3.select(this).datum() + ")", false, false);
            });

      }


      helper_build_structure();
      helper_build_incrs();
      helper_build_sort();


      // Collapse Change Shading initially
      //d3.select("#Change_Shading.expandable").style("display","none");

    }

    // Printout
    nav.printout = function(origin, key, print_totals, print_nav_dim) {

      if (DUMP) {

        var output_lines = [new Date() + "\t" + origin + "\t" + key + "\t", file_name];

        if (print_totals) {
          output_lines.push("print_totals");
          for (var f = 1; f < filters_datasets.length; f++) {
            var filters_containers = filters_datasets[f];
            for (var d = 0; d < filters_containers.length; d++) {
              var datum = filters_datasets[f][d];
               output_lines.push(f + " " + d + " " +  datum.num_hl + "-" + datum.num_fl
                         + "/" + datum.num_total + "\t");
            }
          }
        }
        if (print_nav_dim) {
          output_lines.push("print_nav_dim");
          output_lines.push("#nav:" + parseInt(nav_panel.style("left")) + "x"
                            + parseInt(nav_panel.style("top"))
                            + ":" + nav_panel.attr("class"));
          var expands = d3.selectAll(".expandable")[0];
          d3.selectAll(".header")[0].forEach(function (node, nindex) {
            var n = d3.select(node);
            output_lines.push(n.datum() + ":" + expands[nindex].clientWidth + "x"
                              + expands[nindex].clientHeight);
          });
        }
        output_lines = output_lines.join("\t");
        window.dump(output_lines + "\n");
      }

    }


    // CONTEX MENU
    function setup_contextmenu() {

         var helper_remove_contextmenu = function (button_path) {
          if (button_path.addEventListener) {
              button_path.addEventListener('contextmenu', function(e) {
                e.preventDefault();
              }, false);
            } else {
              button_path.attachEvent('oncontextmenu', function() {
                window.event.returnValue = false;
              });
            }
        }

        var buttons_path = nav_panel.selectAll("#Manage_Nodes .modes .clicker");
        buttons_path[0].forEach(helper_remove_contextmenu);
        buttons_path = nav_panel.selectAll("#sort_order p");
        buttons_path[0].forEach(helper_remove_contextmenu);
//	buttons_path = d3.selectAll(".chart_context_menu");
//        buttons_path[0].forEach(helper_remove_contextmenu);
      }

  return nav;
};
