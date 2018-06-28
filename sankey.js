// SOURCE:
// http://stackoverflow.com/questions/21539265/d3-sankey-charts-manually-position-node-along-x-axis
d3.sankey = function() {

  // CLONED CODE
  var disp_w = 2, prod_h = 0, coll_h = 1;
  var MILLI_IN_DAY = 86400000;

  // INSTANCE VARIABLES
  // Instance variables (the big ones)
  var sankey = {},
      nodeWidth = 24,
      nodePadding = 8,
      size = [1, 1, 1], // width, product height, collab height
      nodes = [],
      people = [],
      collabs = [],
      legend = [],
      links = [],
      streams = [],
      membership = [],
      collabsByDateByPeople = [],
      peopleByDate = [],
      bin_size = 30;

  // Instance Variables (time, scales)
  var parseDate = d3.time.format("%Y-%m-%d").parse, // for default; grand data
      //d3.time.format("%y-%b-%d").parse,
       //d3.time.format("%d/%m/%Y").parse, // for student data
    dateScale = d3.time.scale(),
    dateExtent = [],
    yScale = [d3.scale.linear(), d3.scale.linear()],
    xTicks = [], string_xTicks = [],
    time_diff = 0,
    do_smudge = true;
  // Instance Variables (general)
  var num_breath = 2,
    linkWidth = 2,
    curvature_stream = 0.4,
	  curvature_link = 0.0;
    var filters_people = [];


    var sort_order = [0];
  sankey.add_order = function(n) {
    var index = sort_order.indexOf(n);
    if (index == -1)
      sort_order.unshift(n);
    else {
      sort_order.splice(index, 1);
      sort_order.unshift(n);
    }
    //console.log("SORT ORDER: ", sort_order);
  }
  sankey.remove_order = function(n) {
    var index = sort_order.indexOf(n);
    if (index != -1)
      sort_order.splice(index, 1);
    //console.log("SORT ORDER: ", sort_order);

  }
  // META SETTING
  var value1 = true;
  var isTypeGroupNeeded = true;//false;
  var debug = {counter:0};

  // VARIABLES (used dominantly by other .js files
  var max_collabs = 0;
  var collabs_count = d3.map();

  // SET/GET FUNCTIONS
  sankey.filters_people = function(_) {
    if (!arguments.length) return filters_people;
    filters_people = _;
    return sankey;
  }
  sankey.xScale = function() {
    return dateScale;
  }
  sankey.yScale = function() {
    return yScale;
  }
  sankey.xTicks = function() {
    return xTicks;
  }
  sankey.string_xTicks = function () {
	return string_xTicks;
  }
  sankey.max_collabs = function() {
    return max_collabs;
  }
  sankey.collabs_count = function() {
    return collabs_count;
  }
  sankey.bin_size = function() {
    return bin_size;
  };
  sankey.isTypeGroupNeeded = function() {
    return isTypeGroupNeeded;
  }
  sankey.num_breath = function (_) {
    if (!arguments.length) return num_breath;
    num_breath = _;
    console.log("num_breath set at: " + num_breath);
    return sankey;
  }; // Set breath
  sankey.do_smudge = function(_) {
    if (!arguments.length) return do_smudge;
    do_smudge = _;
    return sankey;
  }; // Set smudge
  sankey.nodeWidth = function(_) {
    if (!arguments.length) return nodeWidth;
    nodeWidth = +_;
    return sankey;
  }; // Set node Width (__)
  sankey.nodePadding = function(_) {
    if (!arguments.length) return nodePadding;
    nodePadding = +_;
    return sankey;
  }; // Set node Padding (==)
  sankey.nodes = function(_) {
    if (!arguments.length) return nodes;
    nodes = _;
    return sankey;
  };
  sankey.people = function(_) {
    if (!arguments.length) return people;
    people = _;
    return sankey;
  };
  sankey.collabs = function(_) {
    if (!arguments.length) return collabs;
    collabs = _;
    return sankey;
  };
  sankey.legend = function(_) {
    if (!arguments.length) return legend;
    legend = _;
    return sankey;
  };
  sankey.links = function(_) {
    if (!arguments.length) return links;
    links = _;
    return sankey;
  };
  sankey.streams = function(_) {
    if (!arguments.length) return streams;
    streams = _;
    return sankey;
  };
  sankey.membership = function(_) {
    if (!arguments.length) return membership;
    membership = _;
    return sankey;
  };
  sankey.collabsByDateByPeople = function(_) {
    if (!arguments.length) return collabsByDateByPeople;
    collabsByDateByPeople = _;
    return collabsByDateByPeople;
  };
  sankey.peopleByDate = function(_) {
    if (!arguments.length) return peopleByDate;
    peopleByDate = _;
    return peopleByDate;
  };
  sankey.size = function(_) {
    if (!arguments.length) return size;
    size = _;
    return sankey;
  };
  sankey.curvature = function(_) {
      if (!arguments.length) return curvature;
      var parts = +_;
	    curvature_stream = parts[0];
	    curvature_link = parts[1];
      return link;
    };
  sankey.linkWidth = function(_) {
    if (!arguments.length) return linkWidth;
    linkWidth = _;
    return sankey;
  };


  // PUBLIC FUNCTIONS

  // +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
  // |G|e|n|e|r|a|t|e| |L|a|y|o|u|t|
  // +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
  sankey.layout = function(window_height) {



    dateScale.range([0,size[disp_w]]);

    computeNodeLinks();
    helper_fix_time();
    helper_add_membership();
    helper_add_select_filter();
    helper_setup_collabsByDateByPeople();
    //helper_add_links();
    helper_setup_stacks();


    computeNodeValues();

    computeNodeDepths(true,
                //       -1);
			window_height);
    computeNodeBreadths();

    return sankey;
  };

  // +-+-+-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
  // |R|e|g|e|n|e|r|a|t|e| |L|a|y|o|u|t|
  // +-+-+-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+
  // Useful when the bin sizes have been adjusted
  sankey.rebreath = function() {

    // Set scale
    dateScale.range([0,size[disp_w]]);

    links = [];

    helper_fix_time();
    helper_setup_collabsByDateByPeople();
    //helper_add_links();
helper_setup_stacks();

    computeNodeDepths(true, -1);
    computeNodeBreadths();



    return sankey;
  };

  // +-+-+-+-+-+ +-+-+-+-+ +-+-+-+-+-+-+-+-+-+
  // |D|o|i|n|g| |w|i|t|h| |F|i|l|t|e|r|i|n|g|
  // +-+-+-+-+-+ +-+-+-+-+ +-+-+-+-+-+-+-+-+-+
  // When filtering out/in nodes. Assumes (correctly in nav.js) that
  //  nodes have already been filtered following a filter function
  sankey.filter = function() {

    links = [];
    //helper_add_links();
helper_setup_stacks();

    computeNodeDepths(true, -1);

  }

  // +-+-+-+-+-+ +-+-+-+-+ +-+-+-+-+-+-+-+-+-+-+-+-+
  // |D|o|i|n|g| |w|i|t|h| |H|i|g|h|l|i|g|h|t|i|n|g|
  // +-+-+-+-+-+ +-+-+-+-+ +-+-+-+-+-+-+-+-+-+-+-+-+
  // When highlighting nodes (defunct because I has been decided not to
  //  re-arrange the nodes in each bin when highlighting it
  // Also good just to recalculate the depth of things after a simple
  //  resizing of the chart
  sankey.sort_nodes = function() {
    computeNodeDepths(true, -1);

  }



  // LINK & STREAM FUNCTIONS

  sankey.getID = function(link) {
    var id = (link.source == null) ? "null" : link.source.id;
    id += "_";
    id += (link.target == null) ? "null" : link.target.id;
    return id;
  }
  function isLinkID(link, isSource, id) {
    if (isSource && link.source != null && link.source.id == id)
      return true;
    if (!isSource && link.target != null && link.target.id == id)
      return true;
    return false;
  }
  function isLinkSourceThisID(link, id) {
    return isLinkID(link, true, id);
  }
  function isLinkTargetThisID(link, id) {
     return isLinkID(link, false, id);
  }
  sankey.get_link_cood = function(d) {
      s_x   = (d.source == null)
        ? dateScale(d.target.Date.getTime())// - temp_time_diff)
        : d.source.x;
      s_dx  = (d.source == null) ? 0 : d.source.dx;
      t_x   = (d.target == null)
        ? dateScale(d.source.Date.getTime()) + bin_size
                    //+ temp_time_diff * 2)
        : d.target.x;
      s_y   = (d.source == null) ? yScale[prod_h](0) : d.source.y;
      s_dy  = (d.source == null) ? 0 : d.source.dy;
      t_y   = (d.target == null) ? yScale[prod_h](0) : d.target.y;
      t_dy  = (d.target == null) ? 0 : d.target.dy;

    return {s_x:s_x, s_y:s_y, t_x:t_x, t_y:t_y, s_dx:s_dx, s_dy:s_dy, t_dy:t_dy};
  };
  // Placement of links
  /*
  sankey.link = function() {

    function link(d) {
      //var temp_time_diff = helper_time_diff(d.source, d.target);
      //console.log("temp_time_diff:", temp_time_diff);

      s_x   = (d.source == null)
        ? dateScale(d.target.Date.getTime())// - temp_time_diff)
        : d.source.x;
      s_dx  = (d.source == null) ? 0 : d.source.dx;
      t_x   = (d.target == null)
        ? dateScale(d.source.Date.getTime()) + bin_size
                    //+ temp_time_diff * 2)
        : d.target.x;
      s_y   = (d.source == null) ? yScale[prod_h](0) : d.source.y;
      s_dy  = (d.source == null) ? 0 : d.source.dy;
      t_y   = (d.target == null) ? yScale[prod_h](0) : d.target.y;
      t_dy  = (d.target == null) ? 0 : d.target.dy;

      if (s_y == t_y)
        return "M" + (s_x + s_dx) + "," + (s_y + s_dy/2) + " " + t_x + "," + (t_y + t_dy/2) + " "
          + t_x + "," + (t_y + t_dy/2 + 1) + " " + (s_x + s_dx) + "," + (s_y + s_dy/2 + 1) + "Z";

      return helper_gen_curve(s_x, s_dx, t_x, s_y, s_dy, t_y, t_dy, true, curvature_link);
    }
    return link;
  };
  */
  // Placement of areas/streams
  sankey.stream = function() {

    function link(d) {

      function get_coods (value, isSource) {
        var value_y = value.y;
        return {x: dateScale(value.date) + bin_size/2,
                y: yScale[coll_h](value_y + value.y0)};
      }

      var ret_val = "";

      for (var bindex=1; bindex < d.values.length; bindex++) {

        var s_coords = get_coods(d.values[bindex-1], true),
            t_coords = get_coods(d.values[bindex], false);

        s_x = s_coords.x;
        s_dx = 0;
        t_x = t_coords.x;
        s_y =  s_coords.y - linkWidth/4;
        s_dy = 0;
        t_y =  t_coords.y - linkWidth/4;
        t_dy = 0;
        var incM = (bindex==1) ? true : false;
        ret_val += helper_gen_curve(s_x, s_dx, t_x, s_y, s_dy, t_y, t_dy,
                                    incM, curvature_stream);
      }

      for (var bindex = d.values.length-1; bindex > 0; bindex--) {

        var s_coords = (d.person == 0) ? {x: 0, y:0 }
                : get_coods(sankey.streams()[d.person-1].values[bindex], true),
            t_coords = (d.person == 0) ? {x: 0, y:0 }
                : get_coods(sankey.streams()[d.person-1].values[bindex-1], false);

        s_x = s_coords.x;
        s_dx = 0;
        t_x = t_coords.x;
        s_y = s_coords.y + linkWidth/4;
        s_dy = 0;
        t_y = t_coords.y + linkWidth/4;
        t_dy = 0;
        var incM = false;
        ret_val += helper_gen_curve(s_x, s_dx, t_x, s_y, s_dy, t_y, t_dy,
                                   incM, curvature_stream);

      }

      return ret_val;
    }
    return link;
  };
  function helper_time_diff(source, target) {
    var temp_time_diff = time_diff;
      if (!do_smudge) {
        if (source == null) {
          temp_time_diff = Math.min( (target.bin == 0)
            ? (xTicks[0] - dateScale.domain()[0])/2
            : (xTicks[target.bin] - xTicks[target.bin-1])/2,
                                   time_diff);
        } else if (target == null) {
          temp_time_diff = Math.min( (source.bin == xTicks.length - 1)
            ? (dateScale.domain()[1] - xTicks[xTicks.length - 1] )/2
            : (xTicks[source.bin+1] - xTicks[source.bin])/2,
                                   time_diff);
        }
      }
    return temp_time_diff;
  }
  function helper_gen_curve(s_x, s_dx, t_x, s_y, s_dy, t_y, t_dy, incM, curvature) {
      var x0 = s_x + s_dx,
          x1 = t_x,
          xi = d3.interpolateNumber(x0, x1),
          x2 = xi(curvature),
          x3 = xi(1 - curvature),
          y0 = s_y + s_dy/2,
          y1 = t_y + t_dy/2;

      var m_part = (incM) ? "M" + x0 + "," + y0 : "";
      var c_part = " C" + x2 + "," + y0
      + " " + x3 + "," + y1
      + " " + x1 + "," + y1 + " ";

      return m_part + c_part;
  }





//    __
//   /_ |  1 of 3   ___          _       _   _          _____ _
//    | |          / __| __ __ _| |___  | |_| |_  ___  |_   _(_)_ __  ___
//    | |          \__ \/ _/ _` | / -_) |  _| ' \/ -_)   | | | | '  \/ -_)
//    |_|          |___/\__\__,_|_\___|  \__|_||_\___|   |_| |_|_|_|_\___|
//
  // Helps set the ticks, smudges the timestamps (set as Date) so that products
  //  fit the histogram number of bins (num_breath)
  function helper_fix_time() {

    if (do_smudge) smudge();
    else nosmudge();

    // Set up the domain for the time scale
    dateExtent = d3.extent(nodes, function (d) { return d.realDate });
    time_diff = (dateExtent[1]-dateExtent[0])/num_breath/2;
    dateScale.domain([new Date(dateExtent[0].getTime()-time_diff),
                      new Date(dateExtent[1].getTime()+time_diff)]);


    bin_size = dateScale(xTicks[1]) - dateScale(xTicks[0]);


    function smudge() {

      xTicks = [], string_xTicks = [];
      var nodes_extent = d3.extent(nodes, function(d) { return d.realDate.getTime(); });

      // Restrict so greater than 1 day
      num_breath = ((nodes_extent[1] - nodes_extent[0])/num_breath < MILLI_IN_DAY)
        ? Math.floor((nodes_extent[1] - nodes_extent[0])/MILLI_IN_DAY) : num_breath;

      // Create a scale to convert the dates to be evenly spaced out.
      var conver_scale = d3.scale.linear().domain([0, num_breath])
        .range(nodes_extent);

      // Calculate the xTicks
      for (var h = 0; h <= num_breath; h++) {
        xTicks.push(new Date(conver_scale(h)));
		string_xTicks.push(new Date(conver_scale(h)).toString());
	  }

      // Actual smudging
      nodes.forEach(function (node) {
        for (var h = 1; h <= num_breath; h++) {
          var date_time = node.realDate.getTime();
          if (date_time > xTicks[h-1] && date_time <= xTicks[h]) {
            node.Date = new Date(xTicks[h-1]);
            node.bin = h-1;
              //xTicks.findIndex(function (tick) { return tick.toString() == node.Date.toString(); });
            break;
          }
        }
      });

    }

    function nosmudge() {
      // Don't do smudging
      var dates = d3.set();
      nodes.forEach(function(node) {
        if (!dates.has(node.Date))
          dates.add(node.Date);
      });
      var dates_arr = dates.values();
      xTicks = [];
      dates_arr.forEach(function(date) {
        xTicks.push(new Date(date)); });
      xTicks.sort(function (a,b) { return a.getTime() - b.getTime(); }) ;
    }
  }

//    __
//   /_ |  2 of 3   __  __           _                _    _
//    | |          |  \/  |___ _ __ | |__  ___ _ _ __| |_ (_)_ __
//    | |          | |\/| / -_) '  \| '_ \/ -_) '_(_-< ' \| | '_ \_ _ _
//    |_|          |_|  |_\___|_|_|_|_.__/\___|_| /__/_||_|_| .__(_|_|_)
//                                                          |_|
  // Set up membership
  function helper_add_membership() {


    people.forEach(function (person, pindex) {
      var mindex = -1;
      membership.forEach(function (member, mind) {
       if (member.person == pindex) mindex = mind;
      });
      if (mindex == -1) {
        membership.push({person:pindex, start:[], end:[]});
      } else {
        if (typeof membership[mindex].start != "undefined") {
          for (var sindex = 0; sindex < membership[mindex].start.length; sindex++)
            membership[mindex].start[sindex] = parseDate(membership[mindex].start[sindex]);
        } else membership[mindex].start = [null];
        if (typeof membership[mindex].end != "undefined") {
          membership[mindex].end.forEach(function(endd) {
            endd = parseDate(endd);
          });
          for (var sindex = 0; sindex < membership[mindex].end.length; sindex++)
            membership[mindex].end[sindex] = parseDate(membership[mindex].end[sindex]);
        } else membership[mindex].end = [null];
        if (membership[mindex].start != null && membership[mindex].end != null) {
          if (membership[mindex].start.length < membership[mindex].end.length)
            membership[mindex].start.unshift(null);
          if (membership[mindex].start.length > membership[mindex].end.length)
            membership[mindex].end.push(null);
        }
      }
    });
    membership.sort(function(a,b) { return a.person - b.person; });

    collabs.forEach(function (collab, cindex) {
       collab.in_group = false;


       if (!(membership[collab.person].start.length == 1
           && membership[collab.person].start[0] == null
             && membership[collab.person].end[0] == null)) {
         for (var dindex = 0; dindex < membership[collab.person].start.length;
              dindex++) {

           if (typeof nodes[collab.product] == "undefined") {
             console.log("ERROR: Missing product for collab: " + collab.product + " of " + nodes.length);
           }

           if (membership[collab.person].start[dindex] != null
               && membership[collab.person].end[dindex] != null
               && membership[collab.person].start[dindex] < nodes[collab.product].realDate
               && membership[collab.person].end[dindex] >= nodes[collab.product].realDate) {
             collab.in_group = true;
             break;
           }
           if (membership[collab.person].start[dindex] == null
              && membership[collab.person].end[dindex] >= nodes[collab.product].realDate) {
             collab.in_group = true;
             break;
           }
           if (membership[collab.person].end[dindex] == null
              && membership[collab.person].start[dindex] < nodes[collab.product].realDate) {
             collab.in_group = true;
             break;
           }
         }
       }
       if (!isTypeGroupNeeded) collab.in_group = true;
    });

  }


// ADD STACKS

 function helper_setup_stacks() {

	peopleByDate = xTicks.map(function(date) {
		return [];
	});
  var stack = d3.layout.stack().values(function(d) { return d.values; });
  streams = stack(people.map(function(person, pin) {


      var temp_var = xTicks.map(function(date, dindex) {
        var sum = (collabsByDateByPeople[pin].has(date)) ?
            d3.sum(collabsByDateByPeople[pin].get(date),
                   function (d) { return nodes[d.product].filtered ? 0 : d.value; })
        : 0;
	    if (sum && peopleByDate[dindex].indexOf(pin) == -1) {
        peopleByDate[dindex].push(pin);
        // Make sure the connect links are from the same point....

        if (dindex != 0 && peopleByDate[dindex-1].indexOf(pin) != -1) {
          if (peopleByDate[dindex].length - 1 != peopleByDate[dindex-1].indexOf(pin)) {
            var smaller = peopleByDate[dindex], larger = peopleByDate[dindex-1];
            if (smaller.length > larger.length) {
                larger = peopleByDate[dindex];
                smaller = peopleByDate[dindex-1];
            }
            var good_index = smaller.indexOf(pin);
            larger[larger.indexOf(pin)] = larger[good_index];
            larger[good_index] = pin;
		      }
		    }
	    }

    var groupness = (collabsByDateByPeople[pin].has(date))
      ? d3.sum(collabsByDateByPeople[pin].get(date), function (d) {
          return (d.in_group && nodes[d.product].filtered == false)? 1 : 0;
         }) : 0;
            return {date: date,
                    y: sum,
                    groupness: groupness
                   };
          });

    temp_var.unshift({date: new Date(xTicks[0]-time_diff*2), y:0, groupness:0});
    return {
      person: pin,
      values: temp_var
    };
  }));
	peopleByDate.unshift([]);
    }


//    __
//   /_ |  3 of 3     _      _    _   _ _      _
//    | |            /_\  __| |__| | | (_)_ _ | |__ ___
//    | |           / _ \/ _` / _` | | | | ' \| / /(_-<
//    |_|          /_/ \_\__,_\__,_| |_|_|_||_|_\_\/__/
//
  // Generate the necessary links for people and their collabs
  function helper_add_links() {

    var existing_link = d3.map();

    function helper_helper_add_link(new_link) {

       // ADD to existing node instead of creating a new node
      // var has_link_id = sankey.findIfndexExistingLink(new_link);
      var ID = sankey.getID(new_link);
      var has_link_id = (existing_link.has(ID)) ? existing_link.get(ID) : -1;


       if (has_link_id != -1) {
         if (links[has_link_id].people.has(new_link.person))
           console.log("ERROR: duplicate collabs for person + product");
         links[has_link_id].people.set(new_link.person, new_link.in_group);
         return;
       } else {
         new_link.people = d3.map();
         new_link.people.set(new_link.person, new_link.in_group);
         // Remove individual value in new_link
         delete new_link['person'];
         delete new_link['in_group'];

         existing_link.set(ID, links.length);
       }


      // Set up links' nodes' source and target
      if (new_link.source != null)
        new_link.source.sourceLinks.push(new_link);
      if (new_link.target != null)
        new_link.target.targetLinks.push(new_link);
      links.push(new_link);
    }
    function helper_create_new_links() {

      function helper_helper_collab_filtered(collab) {
        if (nodes[collab.product].filtered )//|| people[collab.person].filtered)
          return true;
        else return false;
      }

        collabsByDateByPeople.forEach(function(person, pindex) {


        xTicks.forEach(function(xTick, xindex) {

          // If person has products in this time bin
          if (person.has(xTick)) {


            // Link starts from ground
            if (xindex == 0 || !person.has(xTicks[xindex-1]) || (person.has(xTicks[xindex-1])
                    && !person.get(xTicks[xindex-1]).some(function(collab) { return !helper_helper_collab_filtered(collab)}))) {
              person.get(xTick).forEach(function (collab) {

                if (!helper_helper_collab_filtered(collab))
                  helper_helper_add_link({person: pindex, source: null,
                                target: nodes[collab.product], value: collab.value,
                                in_group: [collab.in_group]}); });

            // Link(s) start from products in previous bin
            } else {
              person.get(xTicks[xindex-1]).forEach(function (collab1) {
                person.get(xTicks[xindex]).forEach(function (collab2) {

                  var fil_collab1 = helper_helper_collab_filtered(collab1),
                      fil_collab2 = helper_helper_collab_filtered(collab2);

                  if (!fil_collab1 && !fil_collab2)
                     helper_helper_add_link({person: pindex, source: nodes[collab1.product],
                              target: nodes[collab2.product], value: collab2.value,
                              in_group: [collab1.in_group, collab2.in_group]});
                });
              });
            }

            // Link goes into the ground
            if (xindex == xTicks.length - 1 || !person.has(xTicks[xindex+1]) || (person.has(xTicks[xindex+1])
                    && !person.get(xTicks[xindex+1]).some(function(collab) { return !helper_helper_collab_filtered(collab)}))) {
              person.get(xTick).forEach(function (collab) {
                if (!helper_helper_collab_filtered(collab))
                  helper_helper_add_link({person: pindex, source: nodes[collab.product],
                              target: null, value: collab.value,
                              in_group: [collab.in_group]})
              });
            }
          }
        });
      });
    }
    function helper_generate_type_group(links) {

      // ___ _   _ ___  ____     ____ ____ ____ _  _ ___
      //  |   \_/  |__] |___     | __ |__/ |  | |  | |__]
      //  |    |   |    |___ ___ |__] |  \ |__| |__| |
      //
      // ADD TYPE_GROUP (for gradients) of link
      // Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
      function reduce(numerator,denominator){
        var gcd = function gcd(a,b){
          return b ? gcd(b, a%b) : a;
        };
        gcd = gcd(numerator,denominator);
        return [numerator/gcd, denominator/gcd];
      }
      links.forEach(function (link, lindex) {

          //console.log("GRAD LINK:", link.source==null, link.target==null, link.people.entries());

          var num_in_start = link.people.entries().filter(function (person, pindex) {
              return person.value[0] == true;
          }).length;
          var num_in_end = link.people.entries().filter(function (person, pindex) {
              return person.value[1] == true;
          }).length;
          var base = link.people.entries().length;


          // Reduce
          var reduce_var1 = reduce(num_in_start,base);
          var reduce_var2 = reduce(num_in_end,base);

          if (reduce_var1[1] != reduce_var2[1]) {
            var var1 = reduce_var1[1];
            var var2 = reduce_var2[1];
            for (var i = 0; i < 2; i++) {
              reduce_var1[i] *= var2;
              reduce_var2[i] *= var1;
            }
          }



          // Moved here from the hl.js create def function
          if (reduce_var2[0] == 0) reduce_var2[0] = reduce_var1[0];

          link.type_group = reduce_var1[0] + "_" + reduce_var2[0] + "_" + reduce_var1[1];
       });
    }


    // 2. Based on collabsByDateByPeople, create new links
    // ---------------------------------------------------

    // vv (IF WE'RE USING SANKEY.LINKS, uncomment!)
    //helper_create_new_links();

    if (isTypeGroupNeeded)
      helper_generate_type_group(links);


    links.forEach(function (link, lindex) {
            if (!isTypeGroupNeeded)
              link.type_group = "1_1_1";
     });


    // ┌─┐┌─┐┌┬┐  ┬ ┬┌─┐  ┌─┐┌┬┐┌─┐┌─┐┬┌─┌─┐
    // └─┐├┤  │   │ │├─┘  └─┐ │ ├─┤│  ├┴┐└─┐
    // └─┘└─┘ ┴   └─┘┴    └─┘ ┴ ┴ ┴└─┘┴ ┴└─┘
    // Set up stacks
    helper_setup_stacks();



  }

//    __
//   /_ |  4 of 3   ___      _        _       __   __ _ _ _
//    | |          / __| ___| |___ __| |_    / /  / _(_) | |_ ___ _ _
//    | |          \__ \/ -_) / -_) _|  _|  / /  |  _| | |  _/ -_) '_|
//    |_|          |___/\___|_\___\__|\__| /_/   |_| |_|_|\__\___|_|
//
  // Add select & filter parameter for display/calculations
  function helper_add_select_filter() {

    // Initial state: non filtered, not selected
    function helper_helper_add_select_filter(part) {
      part.selected = false;
      part.filtered = false;
    }

    nodes.forEach(function (node) { helper_helper_add_select_filter(node); });
    people.forEach(function (person) { helper_helper_add_select_filter(person); });
    links.forEach(function (link) { helper_helper_add_select_filter(link); });
    streams.forEach(function (stream) { helper_helper_add_select_filter(stream); });

  }

  //    __    5 of 3
  //   /_ |
  //    | |
  //    | |   Set up collabsByDateByPeople
  //    |_|
  //
  function helper_setup_collabsByDateByPeople() {
      collabsByDateByPeople = new Array(people.length);
      collabs.forEach(function(collab, index) {

        // Save people and their contributions to this node (product)
        collab.value = (value1) ? 1 : collab.value;
        nodes[collab.product].people.set(collab.person,
          {groupness:collab.in_group, value:collab.value});

        // Sort collabs into date and people
        if (typeof collabsByDateByPeople[collab.person] == "undefined")
          collabsByDateByPeople[collab.person] = new d3.map();
        var date_time = nodes[collab.product].Date;
        if (!collabsByDateByPeople[collab.person].has(date_time)) {
          collabsByDateByPeople[collab.person].set(date_time,[collab]);
	} else {
		collabsByDateByPeople[collab.person].get(date_time).push(collab);
	}

      });

/*	collabsByDateByPeople.forEach(function (person, pindex) {
		console.log("node:", person.keys());
	});*/

    }

//////////////
//    __    //
//   /_ |   //
//    | |   //
//    | |   //
//    | |   //
//    |_|   //
//          //
//////////////

  // 1. Populate the sourceLinks and targetLinks for each node.
  // Also, if the source and target are not objects, assume they are indices.
  function computeNodeLinks() {

    nodes.forEach(function(node) {
      node.sourceLinks = [];
      node.targetLinks = [];
      node.Date = parseDate(node.Timestamp);
      node.realDate = parseDate(node.Timestamp);
      node.people = d3.map();

      node.desc = (typeof node.desc == "undefined") ? "" : node.desc;

      // Description
    /*  node.name = "<span>" + node.name.substring(0, node.name.lastIndexOf("/"))
        + "</span>" + node.name.substring(node.name.lastIndexOf("/"));
      node.desc = (node.desc.indexOf("<COMMIT>") != -1)
        ? "<ul class=\"commit_messages\"><li>" + node.desc.replace(/<COMMIT>/g,"</li><li>") + "</li></ul>"
        : node.desc;
        */
    });

    links.forEach(function(link) {
      var source = link.source,
          target = link.target;
      if (typeof source === "number") source = link.source = nodes[link.source];
      if (typeof target === "number") target = link.target = nodes[link.target];
      source.sourceLinks.push(link);
      target.targetLinks.push(link);
    });

    // Preprocess people
    people.forEach(function(person,pindex) {
  //    people[pindex].name += " " + pindex;
      people[pindex].name = person.name.replace(/_/g, " ");
    });

    // Preprocess Product type
    legend.forEach(function(item, iindex) {
      legend[iindex].name = item.name.replace(/_/g, " ");

    });

  }

//////////////
//   ___    //
//  |__ \   //
//     ) |  //
//    / /   //
//   / /_   //
//  |____|  //
//          //
//////////////

  // 2. Compute the value (size) of each node by summing the associated links.
    function computeNodeValues() {
      nodes.forEach(function(node) {


        if (node.people.size() > max_collabs)
          max_collabs = node.people.size();
        if (!collabs_count.has(node.people.size()))
          collabs_count.set(node.people.size(), 0);
        collabs_count.set(node.people.size(), parseInt(collabs_count.get(node.people.size()))+1);

        // Assume that all nodes have the same value
        node.value = (value1) ? 1.0
          : Math.max(
          d3.max(node.sourceLinks, value),
          d3.max(node.targetLinks, value));
        if (isNaN(node.value)) node.value = 1.0;

        // MOD: Undo ^ this to caluclate node height based on source and target links
/*
        node.value = Math.max(
              d3.sum(node.sourceLinks, value),
              d3.sum(node.targetLinks, value)
            );
*/
      });


    }


//////////////
//   ____   //
//  |___ \  //
//    __) | //
//   |__ <  //
//   ___) | //
//  |____/  //
//          //
//////////////
    // 3. Iteratively assign the breadth (x-position) for each node.
    // Nodes are assigned the maximum breadth of incoming neighbors plus one;
    // nodes with no incoming links are assigned breadth zero, while
    // nodes with no outgoing links are assigned the maximum breadth.
    function computeNodeBreadths() {
      nodes.forEach(function(node) {
        node.x = dateScale(node.Date);
        node.dx = nodeWidth - nodePadding/2;
        node.x += bin_size/2 - node.dx/2;
      });
    }


//////////////
//   _  _   //
//  | || |  //
//  | || |_ //
//  |__   _|//
//     | |  //
//     |_|  //
//          //
//////////////

    // 4. Figure out where to put the node (vertically)
    function computeNodeDepths(sort_selected, window_height) {

        var sort_by_sel_test = function(a,b) { return b.selected != a.selected; }
        var sort_by_date_test = function(a,b) {
          return b.realDate.getTime() != a.realDate.getTime(); }
        var sort_by_contrib_test1 = function(a,b) { return b.people.keys().length != a.people.keys().length; }
        var sort_by_contrib_test2 = function(a,b) { return b.people.keys().toString() != a.people.keys().toString(); }
        var sort_by_type_test = function(a,b) { return b.type != a.type; }
        var sort_by_name_test = function(a,b) { return b.name != a.name; }
        var sort_tests = [sort_by_date_test, sort_by_sel_test, sort_by_contrib_test1,
                          sort_by_contrib_test2, sort_by_type_test, sort_by_name_test];
        var sort_by_sel_return = function(a,b) { return b.selected - a.selected; }
        var sort_by_date_return = function(a,b) { return b.realDate.getTime() - a.realDate.getTime(); }
        var sort_by_contrib_return1 = function(a,b) { return b.people.keys().length - a.people.keys().length; }
        var sort_by_contrib_return2 = function(a,b) { return b.people.keys().toString().localeCompare(a.people.keys().toString()); }
        var sort_by_type_return = function(a,b) { return b.type - a.type; }
        var sort_by_name_return = function(a,b) { return b.name.localeCompare(a.name); }
        var sort_returns = [sort_by_date_return, sort_by_sel_return, sort_by_contrib_return1,
                            sort_by_contrib_return2, sort_by_type_return, sort_by_name_return];


      var nodesByBreadth = d3.nest()
      .key(function(d) { return d.Date; })
      .sortKeys(d3.ascending)
      .entries(nodes)
      .map(function(d) { return d.values; });


      // Sort??? USEFUL!
      nodesByBreadth.sort(function(a,b) {
        if (a.length == 0 || b.length == 0)
          return 0;
        else return a[0].Date - b[0].Date;
      });

      nodesByBreadth.forEach(function (breath) {
        breath.sort(function (a, b) {

          for (var i = 0; i < sort_order.length; i++) {
            if (sort_tests[sort_order[i]](a,b))
              return sort_returns[sort_order[i]](a,b);
          }

            return b.id - a.id;
        });
      });


      /*
      nodesByBreadth.forEach(function (breath) {
        breath.sort(function (a, b) {
            if (b.realDate == a.realDate)
              return b.id - a.id;
//          if (a.selected == b.selected || !sort_selected)
            return b.realDate - a.realDate;
//          else
//            return b.selected - a.selected;
        });
      });
      */

      // Place the nodes on the ceiling the svg canvas
      function initializeNodeDepth() {

        // Find ideal y-axis measurements
        var yMax_products = d3.max(nodesByBreadth, function(nodes) {
          return d3.sum(nodes, function(node) { return node.value; }) });
        var yMax_collabs = d3.max(nodesByBreadth, function (nodes) {
          return d3.sum(nodes, function(node) { return node.people.size(); }) });
	var max_y_ticks = Math.max(yMax_products);//, d3.max(peopleByDate, function (people) { return people.length }));


        if (window_height != -1) {
          nodeWidth = Math.max(0.01, window_height / (yMax_collabs + max_y_ticks + 2));
        }

        size[prod_h] = max_y_ticks * nodeWidth;
        size[coll_h] = yMax_collabs * nodeWidth;
        yScale[prod_h].range([size[prod_h], 0])
          .domain([0, max_y_ticks + 1]);
        yScale[coll_h].range([size[coll_h], 0])
          .domain([yMax_collabs + 1,0]);

        // PRODUCT
        // Scale node.dy such that it fits the allowable height
        nodesByBreadth.forEach(function(nodes, bindex) {
          var aggregValue = 0;
          nodes.forEach(function(node, i) {
            // Done in the smudging process...
            //node.bin = xTicks.findIfndex(function (tick) { return tick.toString() == node.Date.toString(); });
              //bindex;
            node.dy = size[prod_h] - yScale[prod_h](node.value) - nodePadding/2;
            node.y = yScale[prod_h](aggregValue + node.value) + nodePadding/4;
            aggregValue += node.filtered ? 0 : node.value;
          });
        });
      }
      initializeNodeDepth();

    }

//////////////
//   _____  //
//  | ____| //
//  | |__   //
//  |___ \  // - NOT USED
//   ___) | //
//  |____/  //
//          //
//////////////

    // 5. Do link depth stuff
    function computeLinkDepths() {

      function ascendingSourceDepth(a, b) {
        return a.source.y - b.source.y;
      }

      function ascendingTargetDepth(a, b) {
        return a.target.y - b.target.y;
      }
    }

    function center(node) {
      return node.y + node.dy / 2;
    }

    function value(link) {
      return link.value;
    }


  // Attributes
    // MANAGE NODES
  // Arrays for filters (under Manage Nodes)
  var filters_teamness = [];
  var filters_products = [];
  var filters_collabs = [];
  var filters_people = [];
  var filters_datasets = [filters_teamness, filters_products, filters_collabs,
                          filters_people];




    return sankey;
  };
