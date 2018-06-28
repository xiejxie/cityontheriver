d3.hl = function () {

  // +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+
  // |I|n|s|t|a|n|c|e| |V|a|r|i|a|b|l|e|s|
  // +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+-+-+-+

  // Original variables put into the system
  var hl = {};

  // Classse and IDs
  var gradient_id = "person_gradient_";
  var sel_id = "sel_";
  var stream_class = "area";
  var streams_class = "collabs";
  var products_class = "products";
  var id_yaxis_svg = "yaxis_svg";
  var id_chart_svg = "chart_svg";
  var setup_prod = "product";
  var setup_coll = "collab";
  var file_name = "name";
  hl.set_file_name = function(name) {
	file_name = name;
	return hl;
  }

  // Colour scales
  var area_opacity_scale = d3.scale.linear().domain([0,10]).range([.4, 1]);
  var link_opacity_scale = d3.scale.linear().domain([0,10]).range([.15,1]);
  var colour_scales = [d3.scale.linear(), d3.scale.linear(), d3.scale.linear()];
  var igc = [17,85,170];
  var ogc = [200,0,0];
  colour_scales.forEach(function (scale, sindex) {
     scale.rangeRound([igc[sindex], ogc[sindex]]);
  });
  var people_colour =
//      ["#B00", "#BF2F00", "#BB0", "#0B0", "#00B", "#3B0032", "#BF0443"]; // Trad rainbow
      //http://www.htmlgoodies.com/tutorials/colors/article.php/3478961
     ["#800000", "#D2691E", "#808000", "#228B22", "#1E90FF", "#483D8B", "#8B008B"];
//["#ff0033", "#ff3333", "#ff6633", "#ff9933", "#ffcc33", "#ffff33", "#cc0033", "#cc3333", "#cc6633", "#cc9933", "#cccc33", "#ccff33", "#990033", "#993333", "#996633", "#999933", "#99cc33", "#99ff33", "#660033", "#663333", "#666633", "#669933", "#66cc33", "#66ff33", "#330033", "#333333", "#336633", "#339933", "#33cc33", "#33ff33", "#000033", "#003333", "#006633", "#009933", "#00cc33", "#00ff33", "#ff00ff", "#ff33ff", "#ff66ff", "#ff99ff", "#ffccff", "#cc00ff", "#cc33ff", "#cc66ff", "#cc99ff", "#ccccff", "#ccffff", "#9900ff", "#9933ff", "#9966ff", "#9999ff", "#99ccff", "#99ffff", "#6600ff", "#6633ff", "#6666ff", "#6699ff", "#66ccff", "#66ffff", "#3300ff", "#3333ff", "#3366ff", "#3399ff", "#33ccff", "#33ffff", "#0000ff", "#0033ff", "#0066ff", "#0099ff", "#00ccff", "#00ffff"];
// Hexagon v ...http://fc07.deviantart.net/fs71/i/2011/290/d/7/hexagon_color_chart_by_skyjohn-d4d6riq.png
//["#F60", "#F30", "#F63", "#C30", "#C03", "#F36", "#F03", "#F06", "#F09", "#F0C", "#F3C", "#C09", "#90C", "#C3F", "#C0F", "#90F", "#60F", "#30F", "#63F", "#30C", "#03C", "#36F", "#03F", "#06F", "#06F", "#09F", "#0CF", "#3CF", "#09C", "#0C9", "#3FC", "#0FC", "#0F9", "#0F6", "#0F3", "#3F6", "#0C3", "#3C0", "#6F3", "#3F0", "#6F0", "#9F0", "#CF0", "#CF3", "#9C0", "#C90", "#FC3", "#FC0", "#F90"];
   // Star Wars!
   // ["#900", "#a26b0a", "#005396", "#df9701", "#67bfed", "#b09e4a", "#552c10", "#956736", "#5c6d40", "#70c9c3", "#042745", "#a6c083", "#8d8a81", "#cbcbcb" ];
      // 221 colours
 // ["rgb(255,204,0)", "rgb(255,153,0)", "rgb(255,102,0)", "rgb(255,51,0)", "rgb(255,204,51)", "rgb(255,204,102)", "rgb(255,153,102)", "rgb(255,102,51)", "rgb(204,153,0)", "rgb(204,153,51)", "rgb(204,102,51)", "rgb(204,51,0)", "rgb(51,51,0)", "rgb(102,102,0)", "rgb(153,153,0)", "rgb(204,204,0)", "rgb(255,255,0)", "rgb(153,102,0)", "rgb(153,51,0)", "rgb(51,0,0)", "rgb(102,0,0)", "rgb(153,0,0)", "rgb(204,0,0)", "rgb(255,0,0)", "rgb(204,255,0)", "rgb(204,255,51)", "rgb(153,204,0)", "rgb(102,102,51)", "rgb(153,153,51)", "rgb(204,204,51)", "rgb(255,255,51)", "rgb(102,51,0)", "rgb(102,51,51)", "rgb(153,51,51)", "rgb(204,51,51)", "rgb(255,51,51)", "rgb(204,0,51)", "rgb(255,51,102)", "rgb(255,0,51)", "rgb(153,255,0)", "rgb(204,255,102)", "rgb(153,204,51)", "rgb(102,153,0)", "rgb(153,153,102)", "rgb(204,204,102)", "rgb(255,255,102)", "rgb(153,102,51)", "rgb(204,102,0)", "rgb(153,102,102)", "rgb(204,102,102)", "rgb(255,102,102)", "rgb(153,0,51)", "rgb(204,51,102)", "rgb(255,102,153)", "rgb(255,0,102)", "rgb(102,255,0)", "rgb(153,255,102)", "rgb(102,204,51)", "rgb(51,153,0)", "rgb(204,204,153)", "rgb(255,255,153)", "rgb(204,153,102)", "rgb(255,153,51)", "rgb(204,153,153)", "rgb(255,153,153)", "rgb(153,0,102)", "rgb(204,51,153)", "rgb(255,102,204)", "rgb(255,0,153)", "rgb(51,255,0)", "rgb(102,255,51)", "rgb(51,204,0)", "rgb(51,102,0)", "rgb(102,204,0)", "rgb(153,255,51)", "rgb(255,255,204)", "rgb(255,204,153)", "rgb(255,204,204)", "rgb(204,102,153)", "rgb(153,51,102)", "rgb(102,0,51)", "rgb(204,0,153)", "rgb(255,51,204)", "rgb(255,0,204)", "rgb(0,255,0)", "rgb(102,153,51)", "rgb(153,204,102)", "rgb(204,255,153)", "rgb(255,153,204)", "rgb(255,51,153)", "rgb(204,0,102)", "rgb(102,51,102)", "rgb(51,0,51)", "rgb(0,204,0)", "rgb(51,255,51)", "rgb(102,255,102)", "rgb(204,153,204)", "rgb(153,102,153)", "rgb(153,51,153)", "rgb(102,0,102)", "rgb(0,153,0)", "rgb(51,204,51)", "rgb(102,204,102)", "rgb(153,255,153)", "rgb(204,255,204)", "rgb(255,204,255)", "rgb(255,153,255)", "rgb(204,102,204)", "rgb(204,51,204)", "rgb(153,0,153)", "rgb(0,102,0)", "rgb(51,153,51)", "rgb(102,153,102)", "rgb(153,204,153)", "rgb(255,102,255)", "rgb(255,51,255)", "rgb(204,0,204)", "rgb(0,51,0)", "rgb(51,102,51)", "rgb(0,204,102)", "rgb(51,255,153)", "rgb(153,255,204)", "rgb(204,153,255)", "rgb(153,102,204)", "rgb(102,51,153)", "rgb(255,0,255)", "rgb(0,255,51)", "rgb(51,255,102)", "rgb(0,204,51)", "rgb(0,102,51)", "rgb(51,153,102)", "rgb(102,204,153)", "rgb(204,255,255)", "rgb(153,204,255)", "rgb(204,204,255)", "rgb(153,51,255)", "rgb(102,0,204)", "rgb(51,0,102)", "rgb(153,0,204)", "rgb(204,51,255)", "rgb(204,0,255)", "rgb(0,255,102)", "rgb(102,255,153)", "rgb(51,204,102)", "rgb(0,153,51)", "rgb(153,255,255)", "rgb(153,204,204)", "rgb(51,153,255)", "rgb(102,153,204)", "rgb(153,153,255)", "rgb(153,153,204)", "rgb(102,0,153)", "rgb(153,51,204)", "rgb(204,102,255)", "rgb(153,0,255)", "rgb(0,255,153)", "rgb(102,255,204)", "rgb(51,204,153)", "rgb(0,153,102)", "rgb(102,255,255)", "rgb(102,204,204)", "rgb(102,153,153)", "rgb(0,102,204)", "rgb(51,102,153)", "rgb(102,102,255)", "rgb(102,102,204)", "rgb(102,102,153)", "rgb(51,0,153)", "rgb(102,51,204)", "rgb(153,102,255)", "rgb(102,0,255)", "rgb(0,255,204)", "rgb(51,255,204)", "rgb(0,204,153)", "rgb(51,255,255)", "rgb(51,204,204)", "rgb(51,153,153)", "rgb(51,102,102)", "rgb(0,51,102)", "rgb(51,51,255)", "rgb(51,51,204)", "rgb(51,51,153)", "rgb(51,51,102)", "rgb(51,0,204)", "rgb(102,51,255)", "rgb(51,0,255)", "rgb(0,255,255)", "rgb(0,204,204)", "rgb(0,153,153)", "rgb(0,102,102)", "rgb(0,51,51)", "rgb(0,102,153)", "rgb(0,51,153)", "rgb(0,0,255)", "rgb(0,0,204)", "rgb(0,0,153)", "rgb(0,0,102)", "rgb(0,0,51)", "rgb(0,153,204)", "rgb(51,153,204)", "rgb(51,102,204)", "rgb(0,51,204)", "rgb(51,204,255)", "rgb(102,204,255)", "rgb(102,153,255)", "rgb(51,102,255)", "rgb(0,204,255)", "rgb(0,153,255)", "rgb(0,102,255)", "rgb(0,51,255)"];

      //  d3.scale.category10().range();
  var product_colour = "#c5941c";//OLD COLOUR:8b6914
  var product_step = 0.5;

  // To do with en-capturing svgs for the chart and the yaxis
  var svg = d3.select("svg#" + id_chart_svg + " g");
  var yaxis_g = d3.select("svg#" + id_yaxis_svg + " g");
  var yaxis_svg = d3.select("svg#" + id_yaxis_svg);
  var chart_container = d3.select("#chart_container");
  var nav_panel = d3.select("#nav");
  var defs = svg.select("defs");
  var  products_group = svg.select("g." + products_class);
  var margin = {top: 20, right: 20, bottom: 30, left: 50}

  // Functions/objects passed in
  var hl_catcher;
  var nav_prod_resize;
  var sankey = d3.sankey();
  hl.width_0 = function () {
    return (sankey.nodes().length > 0) ? sankey.nodes()[0].dx : sankey.nodeWidth()
  }
  //var num_breath = sankey.num_breath();
  //var nodeWidth = sankey.nodeWidth();

  // META
  var DUMP = false;
//    = true;
  var use_help_tooltips = false;


  // Horozontal resize
  var arrow = d3.select("#right_arrow");
  var arrow_margin = margin.right;

  // Highlight the related products or/and collaborators
  var setting_highlighted = "mousedown";
  var setting_highlighted_preview = "mouseover";
  var setting_highlighted_preview_off = "mouseout";
  var setting_title_box_stay = "111contextmenu";
  var duration = 1000;//1000;
  var delay = 0;//100;

  // Hovering Tooltip
  var title_box;
  var pattern_id = "pattern_id_";

  // Hovering pattern
  var pattern_select_repeat = 10;
  var min_height_pattern  = 10;

  // Canvas
  var use_canvas = false;
  var use_canvas_grid = false;
  var canvas_person_id = "canvas_person_id_";
  var canvas_axis;
  var canvas_people = [];

  // Cloned code
  var disp_w = 2, prod_h = 0, coll_h = 1;

  // X-axis stuff
  var xaxis_format = d3.time.format("%b %d, '%y");//"%y-%b-%d / %I %p");
  var xaxis_format_sm = d3.time.format("%b %d, '%y / %I %p");
  var isSmall = false;
  var MILLI_IN_DAY = 86400000;


  // Original parameters
  var originally = {width: 20, nodeWidth: 30, num_breath: 50};

  // SET/GET FUNCTIONS
  hl.id_yaxis_svg = function(_) {
    if (!arguments.length) return id_yaxis_svg;
    id_yaxis_svg = _;
    yaxis_svg = d3.select("svg#" + id_yaxis_svg);
    return hl;
  }
  hl.id_chart_svg = function(_) {
    if (!arguments.length) return id_chart_svg;
    id_chart_svg = _;
    return hl;
  }
  hl.use_canvas = function (_) {
    if (!arguments.length) return use_canvas;
    use_canvas = _;
    return hl;
  }
  hl.area_opacity_scale = function (_) {
    if (!arguments.length) return area_opacity_scale;
    area_opacity_scale = _;
    return hl;
  };
  hl.link_opacity_scale = function (_) {
    if (!arguments.length) return link_opacity_scale;
    link_opacity_scale = _;
    return hl;
  };
  hl.colour_scales = function (_) {
    if (!arguments.length) return colour_scales;
    colour_scales = _;
    return hl;
  };
  hl.igc = function (_) {
    if (!arguments.length) return igc;
    igc = _;
    return hl;
  };
  hl.ogc = function (_) {
    if (!arguments.length) return ogc;
    ogc = _;
    return hl;
  };
  hl.svg = function (_) {
    if (!arguments.length) return svg;
    svg = _;
    return hl;
  };
  hl.defs = function (_) {
    if (!arguments.length) return defs;
    defs = _;
    return hl;
  };
  hl.product_colour = function (_) {
    if (!arguments.length) return product_colour;
    product_colour = _;
    return hl;
  };
  hl.product_step = function (_) {
    if (!arguments.length) return product_step;
    product_step = _;
    return hl;
  };
  hl.sankey = function (_) {
    if (!arguments.length) return sankey;
    sankey = _;
    num_breath = sankey.num_breath();
    nodeWidth = sankey.nodeWidth();
    return hl;
  };
  hl.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return hl;
  };
  hl.hl_catcher = function (_) {
    if (!arguments.length) return hl_catcher;
    hl_catcher = _;
    return hl;
  };
  hl.nav_prod_resize = function (_) {
    if (!arguments.length) return nav_prod_resize;
    nav_prod_resize = _;
    return hl;
  }
  hl.people_colour = function (_) {
    if (!arguments.length) return people_colour;
    people_colour = _;
    return hl;
  }
  hl.originally = function (_) {
    if (!arguments.length) return originally;
    originally = _;
    return hl;
  }


  // +-+-+-+-+ +-+-+-+-+
  // |N|o|d|e| |f|i|l|l|
  // +-+-+-+-+ +-+-+-+-+
  hl.node_proj_colour = function (d) {

    colour_scales.forEach(function (scale) { scale.domain([d.grps, 0]); });
    var sum = d.in_grp;
//console.log("sum:", d.in_grp, d.grps);
/*
    var ret_colour = (d.grps != 0)
    ? "rgb(" + colour_scales[0](sum) + "," + colour_scales[1](sum) + "," + colour_scales[2](sum) + ")"
    : "#888";
*/
    var ret_colour = "rgb(" + 255*(d.in_grp/d.grps) + ","
	+ 255*(d.in_grp/d.grps) + "," + 255*(d.in_grp/d.grps) + ")";
    return ret_colour;
  }
  // Fill colour for product node based off number of people in data
  hl.unsel_node_fill = function(d) {
    return d3.rgb(product_colour).darker(d.people.size()*product_step);  }
  // Fill colour for product node based off group ness (#in/out-team) in data
  hl.sel_node_fill = function (d) {

    // Old version based on associated products' projects related to the people who worked on it
    //colour_scales.forEach(function (scale) { scale.domain([d.people.size(), 0]); });
    //var sum = d3.sum(d.people.values(), function (person) { return person.groupness ? 1 : 0 });
    // var ret_colour = (d.people.size() != 0)
    //    ? "rgb(" + colour_scales[0](sum) + "," + colour_scales[1](sum) + "," + colour_scales[2](sum) + ")"
    //    : "#ccc";
   //return d3.rgb(hl.node_proj_colour(d)).darker(d.people.size()/2);
    return d3.rgb(igc[0], igc[1], igc[2]).darker(d.people.size()/2);

  }

  var stream_sel_fill_value = function(stream) {
    return (sankey.nodeWidth() > min_height_pattern) ? "url(#" + pattern_id + stream.person + ")"
                     : "url(#" + gradient_id + stream.person + ")";
	}
  var stream_fill_value = function(d,i) {
//    return people_colour[d.person%people_colour.length];
    return "url(#" + gradient_id + d.person + ")";
  };
  var link_fill_value = function (person, pindex) {
        return people_colour[pindex%people_colour.length];
	 // return "url(#" + gradient_id + pindex + ")";
  };
  var stream_link_fill_value = function (d,i) {
		//return "url(#" + gradient_id + d.person + ")";
		return people_colour[d.person % people_colour.length];
    //return "white";
  }



  hl.sort_out_node_fill = function (d) {
    return d.selected ? hl.sel_node_fill(d) : hl.unsel_node_fill(d);
  };
  hl.sort_out_node_stroke = function(d) {
//    return sankey.isTypeGroupNeeded() ? hl.node_proj_colour(d) : hl.sort_out_node_fill(d);
	return hl.sort_out_node_fill(d);
  }


  hl.generate_link_d = function (person,pindex) {

      var width_0 = hl.width_0();
      var string_path = "";

      // Find all the bins with filtered nodes
      var bins_for_person = [];

	sankey.streams()[pindex].values.forEach(function(value, this_bin) {

		if (value.y == 0)
			return;
		var has_prev = this_bin != 0 && sankey.streams()[pindex].values[this_bin-1].y > 0;
		var has_next = this_bin != sankey.streams()[pindex].values.length-1
			&& sankey.streams()[pindex].values[this_bin+1].y > 0;

//        var this_bin = sankey.string_xTicks().indexOf(date_string);
//	var has_prev = bins_for_person.indexOf(sankey.string_xTicks()[this_bin-1]);
//	var has_next = bins_for_person.indexOf(sankey.string_xTicks()[this_bin+1]);

        // Depending if there's a node in the next or previous
        var prev_padding = (has_prev) ? 0
            : Math.min(sankey.bin_size()/4, (sankey.bin_size()/2 - sankey.nodeWidth()/2)/2);
        var next_padding = (has_next) ? 0
            : -Math.min(sankey.bin_size()/4, (sankey.bin_size()/2 - sankey.nodeWidth()/2)/2);

	// Draw going in
	var m_x = sankey.xScale()(value.date) + prev_padding;
	var m_y = sankey.yScale()[prod_h](sankey.peopleByDate()[this_bin].indexOf(pindex)+1);
	var m_x2 = sankey.xScale()(value.date) + sankey.bin_size() + next_padding;
	var m_y2 = sankey.yScale()[prod_h]
		(sankey.peopleByDate()[(has_next ? this_bin+1 : this_bin)].indexOf(pindex)+1);
  if (!has_prev)
		m_y = sankey.yScale()[prod_h](0);
	if (!has_next)
		m_y2 = sankey.yScale()[prod_h](0);


	person.get(value.date.toString()).forEach(function(collab, cindex) {

    var node = sankey.nodes()[collab.product];
		if (node.filtered) return;

		// Shift the connections so that they don't overlap on the product node
		var diff = width_0 / (node.people.size() + 1);
		var link_position = -node.dy/2 + (node.people.keys().sort().reverse().indexOf("" + pindex)+1)
			* diff;

		var t_x = node.x, t_y = node.y + node.dy/2 + link_position;
		var ctrl_x = m_x + (t_x - m_x), ctrl_y = m_y + (t_y - m_y);

		  //string_path += " M" + m_x + " " + m_y + " L " + t_x + " " + t_y;
		  string_path += " M" + m_x + "," + m_y
		    + " C " + m_x + "," + ctrl_y
		    + " " + t_x + "," + ctrl_y
		    + " " + t_x + "," + t_y;
		// Draw going out
		var s_x = node.x + node.dx, s_y = node.y + node.dy/2 + link_position;
		ctrl_x = s_x + (m_x2 - s_x);

		  //string_path += " M" + s_x + " " + s_y + " L " + m_x2 + " " + m_y2;
		  string_path += " M" + s_x + "," + s_y
		    + " C" + ctrl_x + "," + s_y
		    + " " + ctrl_x + "," + m_y2
		    + " " + m_x2 + "," + m_y2;

		});
	});
     return string_path;
  };

  var title_box_locked = false;
  hl.move_title_box = function(d3_event, text, classname) {

     var cursor_padding = 10;
    if (classname=="help" && !use_help_tooltips)
      return;

    if (title_box_locked)
      return;

     title_box
        .style("display","block")
        .attr("class", classname)
        .html(text)
       .style("opacity",0)
       .transition().duration(duration*.25).delay((classname=="help") ? duration : delay)
       .style("opacity",1);

      var style_left = cursor_padding - window.pageXOffset + d3_event.pageX;
      var style_top = cursor_padding - window.pageYOffset + d3_event.pageY;
      var style_right = style_left + title_box.node().clientWidth;
      var style_bottom = style_top + title_box.node().clientHeight;

      if (style_right > window.innerWidth)
        style_left -= title_box.node().clientWidth + cursor_padding * 2;
      if (style_bottom > window.innerHeight)
        style_top -= title_box.node().clientHeight + cursor_padding * 2;

      style_top = Math.max(cursor_padding, style_top);

      title_box
        .style("left", style_left + "px")
        .style("top", style_top + "px")
      ;
  }
  hl.hide_title_box = function() {
    if (!title_box_locked)
      title_box.style("display","none");
  }
  hl.lock_title_box_data = function(d,i) {
	title_box_locked = false;
	helper_move_title_box(d3.event,d,i);
	title_box_locked = true;
  }

  // +-+-+-+-+-+-+-+-+-+
  // |H|i|g|h|l|i|g|h|t|
  // +-+-+-+-+-+-+-+-+-+
  function helper_move_title_box(d3_event, data, element_i) {

      var parentClass = d3.select(d3_event.target.parentNode).attr("class");
//      var data = d3.select(d3_event.target).datum();
      var text_function = (parentClass == "node")
        ? hl.print_icon_title(data) : (parentClass == "products")
        ? hl.print_link_title(data, element_i) : hl.collab_title(data);

      hl.move_title_box(d3_event, text_function, "info");

    }
  // Highlight appropriate parts
  hl.helper_highlight_prod_collab = function (d, element_i) {

	if (d3.event.button == 1) {
		hl.lock_title_box_data(d,element_i);
		return;
	}

    var people_involved = (typeof d.people != "undefined") ? d.people.keys() : [element_i];
      //: [d.person];
    var isTemp = (d3.event.type == setting_highlighted_preview) ? true : false;

    var key = [(isTemp) ? "Highlight>" : "Click>"];
    key.push((d3.event.pageX - window.pageXOffset) + ","
             + (d3.event.pageY - window.pageYOffset));
    key.push((typeof d.people != "undefined")
      ? "Product(" + d.id + "):" + d.people.keys().toString()
      : "Person(" + people_involved.toString() + ")");
    hl.printout("HL:highlight_prod_collab", key.join(""), true, false);

    // Move the title box
    if (isTemp) helper_move_title_box(d3.event, d, element_i);

    //people_involved.forEach(function (pindex, sindex) {
    for (var sindex = 0; sindex < people_involved.length; sindex++) {
      var pindex = people_involved[sindex];


      // Fix Collab streams
      var this_collab = d3.select("." + streams_class + " #n" + pindex)
      .attr("fill-opacity", area_opacity_scale(area_opacity_scale.domain()[1]
        - isTemp * area_opacity_scale.domain()[1] * 1/3
        - isTemp * area_opacity_scale.domain()[1] * 1/3 * !sankey.people()[pindex].selected))

      .attr("fill", stream_sel_fill_value);
      // Fix Product links
      if (use_canvas) {
        d3.select("canvas#" + canvas_person_id + pindex)
        .style("opacity", link_opacity_scale(link_opacity_scale.domain()[1]
                                             - isTemp * link_opacity_scale.domain()[1] * 1/3
                                             - isTemp * area_opacity_scale.domain()[1] * 1/3 * !sankey.people()[pindex].selected))
        .style("z-index", 4);
      } else {
        d3.selectAll("." + products_class + " path.n" + pindex)
        .style("stroke-opacity", link_opacity_scale(link_opacity_scale.domain()[1]
                                                    - isTemp * link_opacity_scale.domain()[1] * 1/3
                                                    - isTemp * area_opacity_scale.domain()[1] * 1/3 * !sankey.people()[pindex].selected));
      }

      // Set selected to true for this person
      sankey.people()[this_collab.datum().person].selected = isTemp
      ? sankey.people()[this_collab.datum().person].selected : true;


      // Fix Product nodes in underlying data
      sankey.nodes()
      .filter(function (node, nindex) { return node.people.has(pindex); })
      .forEach(function (prod) { helper_highlight_prod_collab_work_with_product(prod) });


      // Update nav... :/
      if (!isTemp)
        hl_catcher(nav_panel.select("#People #n" + pindex + " div.Highlight"));

    }//);

    // If no people, do something..
    if (people_involved.length == 0) {
      helper_highlight_prod_collab_work_with_product(d)
    }


    // helper_highlight_prod_collab_work_with_product:
    //     Added the product to our collections so that we can do stuff with it later
    function helper_highlight_prod_collab_work_with_product(prod) {

      var this_prod = d3.select("." + products_class + " rect#n" + prod.id)
        .attr("fill", function (d) { return d.selected
          ? d3.rgb(hl.sel_node_fill(d)).brighter(3) : hl.sel_node_fill(d).brighter(6); })
        .style("stroke", !sankey.isTypeGroupNeeded() ? hl.sel_node_fill : hl.node_proj_colour);
      this_prod.datum().selected = isTemp ? this_prod.datum().selected : true;

    }

  }
  // Undo highglight if only temporary and not selected
  hl.helper_de_highlight_prod_collab = function (d) {

   // hl.hide_title_box();

    // NODES
    // Remove nodes from the preview but not the highlighted set (d.selected == true)
    hl.node_draw_simple();

    // STREAMS
    d3.selectAll("." + streams_class + " .area")
    .attr("fill-opacity", function (d) {
      return  sankey.people()[d.person].selected
      ? area_opacity_scale.range()[1]
      : area_opacity_scale(1)   })
    .attr("fill", function (d) {
      return sankey.people()[d.person].selected && sankey.nodeWidth() > min_height_pattern
        ? stream_sel_fill_value(d) : stream_fill_value(d);
     });



    // LINKS
    if (use_canvas) {
      d3.selectAll("canvas." + canvas_person_id)
      .style("opacity", function (d, i) {
        return (sankey.people()[i].selected) ? link_opacity_scale.range()[1] : link_opacity_scale.range()[0];
      })
      .style("z-index", function (d,i) {
        return (sankey.people()[i].selected) ? 3 : 5;
      });
      ;
    } else {
      d3.selectAll(".link")
      .style("stroke-opacity", function (d,i) {
        return sankey.people()[i].selected ? link_opacity_scale.range()[1] : link_opacity_scale.range()[0];
      });
      /*
      d3.selectAll("." + products_class + " path")
      .style("stroke-opacity", function (d) {
        var has_some = d.people.keys().some(function (person, pindex) {
          return sankey.people()[person].selected;
        });
        return (has_some) ? link_opacity_scale.range()[1] : link_opacity_scale.range()[0] * d.people.size();
      });*/
    }



  }


  // +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+ +-+ +-+-+-+-+
  // |R|e|s|i|z|i|n|g| |C|a|n|v|a|s| |/| |V|i|e|w|
  // +-+-+-+-+-+-+-+-+ +-+-+-+-+-+-+ +-+ +-+-+-+-+
  // Re-sizing the bins or the node width (and height because they're square)
  var resize_bins = function() {

    var redraw_var = (sankey.num_breath() == num_breath) ? false : true;


    /*
    if (nodeWidth > min_height_pattern && sankey.nodeWidth() <= min_height_pattern)
      d3.selectAll(".area")
        .attr("fill", function (d) {
          return sankey.people()[d.person].selected
            ? stream_sel_fill_value(d) : stream_fill_value(d) });
    else if (nodeWidth <= min_height_pattern && sankey.nodeWidth() > min_height_pattern) {
     // console.log("GETTING SMALLER");
        d3.selectAll(".area")
          .attr("fill", function (d) { return "url(#" + gradient_id + d.person + ")"; });
    }
    */

    sankey.num_breath(num_breath);
    sankey.nodeWidth(nodeWidth);
    sankey.rebreath();
    num_breath = sankey.num_breath();

    hl.draw_graph_resize(redraw_var);



    // Scroll window to center on x-axis

    d3.transition()
      .delay(delay)
      .duration(duration)
      .tween("scroll", scrollTween(sankey.yScale()[prod_h](0) + margin.top - window.innerHeight*3/5));

    function scrollTween(offset) {
      return function() {
        var i = d3.interpolateNumber(window.pageYOffset || document.documentElement.scrollTop, offset);
        return function(t) { scrollTo(window.pageXOffset, i(t)); };
      };
    }




  }


  // Update the position of the y-axis so that it is aligned with the grid
  window.onscroll = function updateYaxis(){
    yaxis_svg.style("top", (8 - window.scrollY) + "px");
  }

  // draw based on settings
  hl.resize_svgs = function() {
    d3.select("svg#" + id_chart_svg)
    .attr("width", (sankey.size()[disp_w] + margin.left + margin.right))
    .attr("height", ((sankey.size()[prod_h] + sankey.size()[coll_h]) + margin.top + margin.bottom));
    yaxis_svg
    .attr("width", margin.left)
    .attr("height", ((sankey.size()[prod_h] + sankey.size()[coll_h]) + margin.top + margin.bottom));
    chart_container.style("height", ((sankey.size()[prod_h] + sankey.size()[coll_h]) + margin.top + margin.bottom + 15) + "px");
  }


  // +-+-+-+-+-+-+-+
  // |D|r|a|w|i|n|g|
  // +-+-+-+-+-+-+-+
  // LINKS
  hl.redraw_prod_links = function() {


// WHEN DELETING use_canvas
// get ride of string_xTicks
    // Draw separate links for each person as their own canvas (only used
    //  if use_canvas = true is set
    function draw_canvas_people() {

      var width_0 = hl.width_0();

	// var start = (new Date()).getTime();
 	//  if (true) {
	  if (false) {

      sankey.links().forEach(function(d, lindex) {

        // Set up gradients
        d.people.keys().forEach(function(person, pindex) {

          var ctx = canvas_people[person];

          var group_var = d.type_group.split("_").map(function (some_int) { return parseInt(some_int) });
          var coords = sankey.get_link_cood(d);
		  //console.log(sankey.getID(d), coords);

          if (sankey.isTypeGroupNeeded()) {
            var grad= ctx.createLinearGradient(coords.s_x + coords.s_dx, coords.s_y + coords.s_dy/2,
                                               coords.t_x, coords.t_y + coords.t_dy/2);
            //if (group_var[2] != 0) {
            colour_scales.forEach(function ( scale, sindex) { scale.domain([group_var[2], 0]); });
            for (var i = 0; i < 2; i++) {
              grad.addColorStop(i, "rgb(" + colour_scales[0](group_var[i]) + ","
                                + colour_scales[1](group_var[i]) + ","
                                + colour_scales[2](group_var[i]) +")");
            }
            //}
            ctx.strokeStyle = grad;
          } else {
            ctx.strokeStyle = people_colour[person%people_colour.length];
          }
          ctx.lineWidth = linkWidth;

          // Shift the connections so that they don't overlap on the product node
          var s_position = 0, t_position = 0;
          if (d.source != null) {
            var diff = width_0 / (d.source.people.size() + 1);
            s_position = -coords.s_dy/2 + (d.source.people.keys().sort().reverse().indexOf(person)+1) * diff;
          }
          if (d.target != null) {
            var diff = width_0 / (d.target.people.size() + 1);
            t_position = -coords.t_dy/2 + (d.target.people.keys().sort().reverse().indexOf(person)+1) * diff;
          }


          // Set values for s_x, s_y, t_x, t_y...etc.
          var null_padding = Math.min(sankey.bin_size()/4, (sankey.bin_size()/2 - sankey.nodeWidth()/2));
          var null_padding = (d.source == null) ? (sankey.bin_size()/2 - sankey.nodeWidth()/2)/2
            : sankey.bin_size()/2 - sankey.nodeWidth()/2 - (sankey.bin_size()/2 - sankey.nodeWidth()/2)/2;

          var s_x = coords.s_x + coords.s_dx + null_padding, s_y = sankey.yScale()[prod_h](parseInt(person)+1);
          if (d.source != null) {
            s_x = coords.s_x + coords.s_dx;
            s_y = coords.s_y + coords.s_dy/2 + s_position;
          }

          var t_x = coords.t_x - null_padding, t_y = sankey.yScale()[prod_h](parseInt(person)+1);
          if (d.target != null) {
            t_x = coords.t_x;
            t_y = coords.t_y + coords.t_dy/2 + t_position;
          }

          ctx.beginPath();
          ctx.moveTo(s_x, s_y);

          // Control point for people...
          if (d.source != null && d.target != null) {
            var m_x = sankey.xScale()(d.target.Date), m_y = sankey.yScale()[prod_h](parseInt(person)+1);
            //ctx.lineTo(m_x, m_y);
            var ctrl_x = s_x + (m_x - s_x);
            ctx.bezierCurveTo(ctrl_x,s_y,ctrl_x,m_y,m_x,m_y);
            s_x = m_x;
            s_y = m_y;
          }

           var ctrl_x = s_x + (t_x - s_x), ctrl_y = s_y + (t_y - s_y);

          if (d.target == null)
            ctx.bezierCurveTo(ctrl_x,s_y,ctrl_x,t_y,t_x,t_y);
          else
            ctx.bezierCurveTo(s_x,ctrl_y,t_x,ctrl_y,t_x,t_y);


          ctx.stroke();

		  //console.log("DRAWING:", person, lindex, sankey.getID(d));
        });

      });

	  } else {

		  sankey.collabsByDateByPeople().forEach(function(person, pindex) {
			//console.log("PERSON:", person.keys());
			var ctx = canvas_people[pindex];
			ctx.strokeStyle = people_colour[pindex%people_colour.length];
			ctx.lineWidth = linkWidth;
			ctx.beginPath();

      // Find all the bins with filtered nodes
      var bins_for_person = [];
      person.keys().forEach(function(date_string) {
        var len = person.get(date_string).filter(function (collab) {
                              return !sankey.nodes()[collab.product].filtered; }).length;
        if (len > 0) bins_for_person.push(date_string);
      });

			bins_for_person.forEach(function(date_string) {

        var this_bin = sankey.string_xTicks().indexOf(date_string);
				var has_prev = bins_for_person.indexOf(sankey.string_xTicks()[this_bin-1]);
				var has_next = bins_for_person.indexOf(sankey.string_xTicks()[this_bin+1]);

        // Depending if there's a node in the next or previous
        var prev_padding = (has_prev != -1) ? 0
            : Math.min(sankey.bin_size()/4, (sankey.bin_size()/2 - sankey.nodeWidth()/2)/2);
        var next_padding = (has_next != -1) ? 0
            : -Math.min(sankey.bin_size()/4, (sankey.bin_size()/2 - sankey.nodeWidth()/2)/2);

				person.get(date_string).forEach(function(collab, cindex) {

					ctx.beginPath();
					var node = sankey.nodes()[collab.product];
          if (node.filtered) return;

          // Shift the connections so that they don't overlap on the product node
					var diff = width_0 / (node.people.size() + 1);
					var link_position = -node.dy/2 + (node.people.keys().sort().reverse().indexOf("" + pindex)+1)
                                  * diff;
          // Draw going in
					//var s_x = coords.s_x + coords.s_dx + null_padding, s_y = sankey.yScale()[prod_h](parseInt(person)+1);
					var m_x = sankey.xScale()(node.Date) + prev_padding,
              m_y = sankey.yScale()[prod_h](parseInt(pindex)+1);
					var t_x = node.x, t_y = node.y + node.dy/2 + link_position;
          var ctrl_x = m_x + (t_x - m_x), ctrl_y = m_y + (t_y - m_y);

          if (sankey.isTypeGroupNeeded())
            ctx.strokeStyle = (!node.people.get(pindex).groupness)
              ? "#333" : people_colour[pindex%people_colour.length];


					ctx.moveTo(m_x, m_y);
					//ctx.lineTo(t_x, t_y);
					ctx.bezierCurveTo(m_x,ctrl_y,t_x,ctrl_y,t_x,t_y);


					// Draw going out
					var s_x = node.x + node.dx, s_y = node.y + node.dy/2 + link_position;
					var m_x = sankey.xScale()(node.Date) + sankey.bin_size() + next_padding;
          ctrl_x = s_x + (m_x - s_x);

					ctx.moveTo(s_x, s_y);
					//ctx.lineTo(m_x, m_y);
          ctx.bezierCurveTo(ctrl_x,s_y,ctrl_x,m_y,m_x,m_y);


					ctx.stroke();

				});
			});
		 });
	  }
	  var end = (new Date()).getTime();
	//  console.log("Link Time: ", end - start);

    }

    if (!use_canvas) {



  //    var start = (new Date()).getTime();
      products_group.selectAll(".link")
       .remove();
      var link = products_group.selectAll(".link")
      .data(sankey.collabsByDateByPeople());
      link.enter()
        .append("path")
        .attr("class", function (d,i) { return "link chart_context_menu n" + i })
        .attr("d", hl.generate_link_d)
        .style("stroke-width", linkWidth)
        .call(apply_style_product_link);
      ;

 //     console.log("use_canvas:" + use_canvas, "Link time", (new Date()).getTime() - start);



      /*
      var path = sankey.link();

      products_group.selectAll(".link")
       .remove();
      var link = products_group.selectAll(".link")
      .data(sankey.links());
      link.enter()
      .append("path")
      .attr("class", function (d) {
        var person_string = "";
        d.people.keys().forEach(function (person, pindex) {
          person_string += "n" + person;
          if (pindex != d.people.size() - 1)
            person_string += " ";
        });
        return "link " + person_string;
      })
      .attr("d", path)
      .style("stroke-width", function(d) {
        var path_var = d3.select(this).attr("d");
        if (path_var.substr(path_var.length - 1) != "Z")
          return linkWidth;
        else return linkWidth/2;
      })
      .call(apply_style_product_link);
    */
      // Draw links on canvas
    } else {

      canvas_people.forEach(function(canvas_person, pindex) {
        canvas_person.clearRect(0, 0, sankey.size()[disp_w]+1,
                                sankey.size()[coll_h] + sankey.size()[prod_h] +1);
        d3.select("canvas#" + canvas_person_id + pindex)
        .style("opacity", sankey.people()[pindex].selected ? link_opacity_scale.range()[1] : link_opacity_scale.range()[0]);
      });
      draw_canvas_people();

    }

  }
  hl.move_prod_links = function() {
    if (!use_canvas) {

     // var start = (new Date()).getTime();

      products_group.selectAll(".link")
      .call(apply_style_product_link)
      .transition().duration(duration).delay(delay)
      .attr("d", hl.generate_link_d)
      /*.style("stroke-width", function(d) {
        if (d.target != null && d.source != null && d.source.y == d.target.y)
          return linkWidth/2;
        else return linkWidth;
      })
      .style("stroke-opacity", function (person, pindex) {
        return
        var has_some = d.people.keys().some(function (person, pindex) {
          return sankey.people()[person].selected;
        });
        return (has_some) ? link_opacity_scale.range()[1] : link_opacity_scale.range()[0] * d.people.size();
      })*/;

    //  console.log("use_canvas:" + use_canvas, "MOVE Link Time:", (new Date()).getTime() - start);

    } else {
      // Canvas is restricting somewhat, so we much use hl.redraw_prod_links
      hl.redraw_prod_links()
    }
  }
  // NODES
  hl.move_prod_nodes = function() {

    d3.selectAll(".node")
    .transition().duration(duration).delay(delay)
    .attr("transform", function(d,i) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .style("opacity", function (d) { return d.filtered ? 0 : 1})
    .style("display", function (d) { return d.filtered ? "none" : "block"});
  }
  hl.node_draw_simple = function() {
    d3.selectAll("." + products_class + " rect")
      .attr("fill",  hl.sort_out_node_fill)
      .style("stroke", hl.sort_out_node_stroke);
  }; // Simply modify nodes -- taking into account if their selected or not
  hl.resize_nodes_parts = function() {
    d3.selectAll(".node rect")
      .transition().duration(duration).delay(delay)
      .attr("height", function(d) { return d.dy; })
      .attr("width", function(d) { return d.dx; });
      d3.selectAll(".node image")
      .transition().duration(duration).delay(delay)
      .attr("x", iconpadding/4 )
      .attr("y", function (d) { return d.dy / 2 - sankey.nodeWidth() / 2 + iconpadding / 2; })
      .attr("height", function (d) { return d.dx - 1 - iconpadding / 2})
      .attr("width", function (d) { return d.dx - 1 - iconpadding / 2});
      d3.selectAll(".node text")
      .transition().duration(duration).delay(delay)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("x", function(d) { return d.dx + 6; });

    // Function for nav panel to resize icons so that they match (roughly)
    nav_prod_resize(hl.width_0() - 1 - iconpadding / 2);

  }
  // STREAMS
  hl.move_coll_streams = function() {

    var stream_area = sankey.stream();
    d3.select("g." + streams_class)
    .transition().duration(duration).delay(delay)
    .attr("transform", "translate(0," + sankey.size()[prod_h] + ")");
    d3.selectAll("." + stream_class)
    .data(sankey.streams())
    .transition().duration(duration).delay(delay)
    .attr("fill-opacity", function (d, i) {
      return  sankey.people()[d.person].selected
      ? area_opacity_scale.range()[1]
      : area_opacity_scale(1)   })
    .attr("d", stream_area);
  }
  // AXISES
  hl.redraw_axises = function() {

    // Set the bin size by dragging the x-axis titles
    var new_bin_size = sankey.bin_size();
    var xaxis_drag = function(d) {

      var bin_size = sankey.bin_size();
      var orig_x1 = sankey.xScale()(d);
      var orig_x0 = orig_x1 - bin_size; //sankey.xScale()((i!=0) ? sankey.xTicks()[i-1] : (orig_x1 - bin_size));

      var movex = Math.min(sankey.size()[disp_w], d3.event.x);
      movex = Math.max(movex, orig_x1 - bin_size, 0,
                       // Restrict so greater than 1 day
                       sankey.xScale()((sankey.xScale().invert(orig_x0).getTime() + MILLI_IN_DAY)));
      new_bin_size = Math.max(movex - (orig_x1 - bin_size), 2); // min width

      svg.select("rect#resize_drawn")
      .style("opacity",0.4)
      .attr("y", 0)
      .attr("x", orig_x0)
      .attr("height", (sankey.size()[prod_h] + sankey.size()[coll_h]))
      .attr("width", new_bin_size);

      movex = orig_x0 + new_bin_size;

      // Update tick value (that you're draggine)
      var time_diff = sankey.xScale().invert(movex) - sankey.xScale().invert(orig_x0);

      // Turned of smaller time format
      var tick_text = (time_diff < MILLI_IN_DAY) ? xaxis_format_sm(sankey.xScale().invert(movex)) :
          xaxis_format(sankey.xScale().invert(movex));

      d3.select(this).select("text")
      .style("fill","red !important")
      .text(tick_text);

      // Number of bins
      num_breath =
        Math.max(1, Math.floor(sankey.size()[disp_w]/new_bin_size));

      d3.select(this)
        .attr("transform", "translate(" + movex + ",0)");

    }
    // Set the node size by dragging the y-axis titles
    var yaxis_drag = function (d) {

      var bin_size = nodeWidth;
      var isProd = d3.select(this.parentNode).attr("class").indexOf(setup_coll) == -1;
      var type_h = isProd ? prod_h : coll_h;
      var min_bin_size = 1;

      var orig_y1 = Math.max(sankey.yScale()[type_h](d), sankey.yScale()[type_h](d-1));
      var orig_y0 = Math.min(sankey.yScale()[type_h](d), sankey.yScale()[type_h](d-1));


      var movey = Math.min(sankey.size()[type_h], d3.event.y);
      movey = Math.max(0, movey);
      movey = isProd ? Math.min(movey, sankey.yScale()[type_h](d-1) + min_bin_size)
      : Math.max(movey, sankey.yScale()[type_h](d-1) - min_bin_size);

      nodeWidth = Math.min(Math.abs(movey - sankey.yScale()[type_h](d-1),1)); // min width = 1px

      svg.select("rect#resize_drawn")
      .style("opacity",0.4)
      .attr("y", isProd ? movey : (sankey.yScale()[type_h](d-1) + sankey.size()[prod_h]))
      .attr("x", 0)
      .attr("height", nodeWidth + "px")
      .attr("width", sankey.size()[disp_w]);

      // Update tick value (that you're draging
      var disp_percise = 100;
      d3.select(this).select("text")
        .style("fill","red");
        //ext(Math.round(sankey.yScale()[type_h].invert(movey)*disp_percise)/disp_percise);


      d3.select(this)
      .attr("transform", "translate(0," + movey + ")");

    }


    // Hover for ticks
    var hover_ticks = function() {

      var on_hover_ticks = function () {
        var part = d3.select(this.parentNode);
        part.select("line").style("stroke-width", "2px");
        part.select("text").style("font-weight", "bold");
      }
      var off_hover_ticks = function () {
        var part = d3.select(this.parentNode);
        part.select("line").style("stroke-width", "1px");
        part.select("text").style("font-weight", "normal");
      }

      var ticks = d3.selectAll(".tick");
      ticks
        .select("line")
        .on(setting_highlighted_preview, on_hover_ticks)
        .on(setting_highlighted_preview_off, off_hover_ticks);
      ticks
        .select("text")
        .on(setting_highlighted_preview, on_hover_ticks)
        .on(setting_highlighted_preview_off, off_hover_ticks);
    };

    if (sankey.xTicks()[1] - sankey.xTicks()[0] < MILLI_IN_DAY) // #milliseconds in a day
      isSmall = true;
    else isSmall = false;


    // X
    var nice_num_breath = Math.round(sankey.size()[disp_w]/30);
    d3.selectAll(".x").filter(".axis")
      .transition().duration(duration).delay(delay)
      .attr("transform", "translate(0," + sankey.size()[prod_h] + ")")
      .call(make_x_axis())
      .selectAll("text")
      .attr("transform", (!isSmall) ? "translate(25,31)rotate(65)" : "translate(34,55)rotate(65)")
      .style("display","none")
      .filter(function(d,i) { return (num_breath > nice_num_breath) ? i%(Math.round(num_breath/nice_num_breath))==0 : true; })
      .style("display","block");
      ;
    // Y
    d3.selectAll(".y").filter(".axis").filter("." + setup_prod)
      .transition().duration(duration).delay(delay)
      .call(make_y_axis(prod_h))
      .selectAll("text")
      .style("display","none")
      .filter(function(d,i) { return (nodeWidth < 15) ? (i%(Math.round(15/nodeWidth))==0) : true; })
      .style("display","block");
    d3.selectAll(".y").filter(".axis").filter("." + setup_coll)
      .transition().duration(duration).delay(delay)
      .attr("transform", "translate(0," + sankey.size()[prod_h] + ")")
      .call(make_y_axis(coll_h))
      .selectAll("text")
      .style("display","none")
      .filter(function(d,i) { return (nodeWidth < 15) ? (i%(Math.round(15/nodeWidth))==0) : true; })
      .style("display","block");
    ;
    hover_ticks();

    var bin_size_old;
    svg.selectAll(".x .tick")
      .on(setting_highlighted_preview, function() {
        hl.move_title_box(d3.event, "<p><strong>Change time bin length</strong></p>"
                       + "<hr /><p>"
                       + "<strong>Drag TOWARDS y-axis:</strong> Smaller<br />"
                       + "<strong>Drag AWAY from y-axis:</strong> Bigger"
                       + "</p>", "help");
      })
      .on(setting_highlighted_preview_off, hl.hide_title_box)
      .call(d3.behavior.drag()
          .on("dragstart", function() {
            bin_size_old = sankey.bin_size();
            this.parentNode.appendChild(this); })
          .on("drag", xaxis_drag)
          .on("dragend", function (d) {
            var i = sankey.xTicks().indexOf(d);
            resize_bins();
            hl.printout("HL:redraw_axis", "Drag>x-ticks>" + d + "(#" + i + ")>"
                        + sankey.bin_size() + " ("
                        + (new_bin_size/bin_size_old) + "="
                        + new_bin_size + "/" + bin_size_old + ")", true, true);

          }))
    ;

    var nodeWidth_old;
    yaxis_g.selectAll(".y .tick")
    .on(setting_highlighted_preview, function() {
      hl.move_title_box(d3.event, "<p><strong>Resize node dimensions</strong></p>"
                     + "<hr /><p>"
                     + "<strong>Drag TOWARDS x-axis:</strong> Smaller<br />"
                     + "<strong>Drag AWAY from x-axis:</strong> Bigger"
                     + "</p>", "help");
    })
    .on(setting_highlighted_preview_off, hl.hide_title_box)
      .call(d3.behavior.drag()
          .on("dragstart", function() {
            nodeWidth_old = nodeWidth;
            this.parentNode.appendChild(this); })
          .on("drag", yaxis_drag)
          .on("dragend", function (d) {
            resize_bins();
            hl.printout("HL:redraw_axis", "Drag>y-ticks>" + d
                        + ">" + nodeWidth + " (" + nodeWidth/nodeWidth_old + "="
                        + nodeWidth + "/" + nodeWidth_old + ")",
                        true, true);
          }))
    ;
    d3.selectAll(".tick text")
      .style("fill","black")
      .style("font-weight","normal");
    d3.selectAll(".tick line").style("stroke-width", "1px");


  }
  // BLACK RECTANGLE
  function hide_black_rect() {
      // Fade away the rectangle that helped with steadying the resize
      d3.select("rect#resize_drawn")
      .transition().duration(duration).delay(delay)
      .attr("x", 0) //sankey.xScale()(sankey.xTicks()[0]) + 1)
      .attr("y",0)
      .attr("height", (sankey.size()[prod_h] + sankey.size()[coll_h]))
      .attr("width", sankey.size()[disp_w])
      .style("opacity",0);

  }
  // SIDE ARROW
  function move_arrow() {
    arrow.transition().duration(duration).delay(delay)
    .style("height", (sankey.size()[prod_h] + sankey.size()[coll_h]) + "px")
    .style("left", (sankey.size()[disp_w] + margin.left + arrow_margin) + "px")
    .select("img")
    .style("top", (sankey.size()[prod_h] - parseInt(arrow.select("img").style("height"))/2) + "px")
    ;
  } // Given resizing of the chart horizontally, need to resize arrow


  // Pretty heavy function redraws all the thing based on new parameters
  //  (Ideal for when the bin sizes have been updated or setting up the chart initially)
  // PARAM: redraw_links - supposed to indicate whether the links should be completely
  //  redrawn or just moved...when use_canvas = true, this makes no difference
  var drawn = false;
  hl.draw_graph_resize = function(redraw_links) {

         //var start = (new Date()).getTime();

      // Draws the grid on a canvas
      function draw_grid_canvas() {

        // Print coordinates
        canvas_axis.beginPath();
        for (var ctx_id = 0; ctx_id <= 2; ctx_id++) {


          var scale = (ctx_id == disp_w) ? sankey.xScale() : sankey.yScale()[ctx_id];
          var min = (ctx_id == disp_w) ? 0 : scale.domain()[0];
          var max = (ctx_id == disp_w) ? sankey.xTicks().length : scale.domain()[1];
          if (ctx_id == coll_h) {
            var temp = min;
            min = max;
            max = temp;
          }

          for (var g = min; g < max; g++) {
            var s_x = (ctx_id == disp_w) ? scale(sankey.xTicks()[g]) : 0,
                t_x = (ctx_id == disp_w) ? scale(sankey.xTicks()[g]) : sankey.size()[disp_w],
                s_y = (ctx_id == disp_w) ? 0 : scale(g),
                t_y = (ctx_id == disp_w) ? sankey.size()[coll_h] + sankey.size()[prod_h] : scale(g);

            s_y += (ctx_id == coll_h) ? sankey.size()[prod_h] : 0;
            t_y += (ctx_id == coll_h) ? sankey.size()[prod_h] : 0;

            canvas_axis.moveTo(s_x, s_y);
            canvas_axis.lineTo(t_x, t_y);

          }
        }

        canvas_axis.strokeStyle = "rgba(211,211,211,.8)";
        canvas_axis.stroke();

      };

      // BACKGROUND & CONTAINERS
      // Resize layers of chart (svg, canvas...etc.)
      hl.resize_svgs();

    if (use_canvas_grid || use_canvas)
      d3.selectAll("canvas")
            .attr("width", sankey.size()[disp_w])
            .attr("height", sankey.size()[prod_h] + sankey.size()[coll_h]);

      if (use_canvas_grid)
        draw_grid_canvas();
      else {

        // GRID X-axis
        d3.selectAll(".x").filter(".grid")
            .attr("transform","translate(0," + (sankey.size()[prod_h] + sankey.size()[coll_h]) + ")")
            .call(make_x_axis()
            .tickSize(-(sankey.size()[prod_h] + sankey.size()[coll_h]), 0, 0)
            .tickFormat(""));

        // GRID Y-axis
        d3.selectAll(".y").filter(".grid").filter("." + setup_prod)
          .call(make_y_axis(prod_h)
            .tickSize(-(sankey.size()[disp_w]), 0, 0)
            .tickFormat(""));
        d3.selectAll(".y").filter(".grid").filter("." + setup_coll)
          .attr("transform", "translate(0," + sankey.size()[prod_h] + ")")
          .call(make_y_axis(coll_h)
            .tickSize(-(sankey.size()[disp_w]), 0, 0)
            .tickFormat(""));

      }

      // ELEMENT OF CHART
      // Links
      hl.helper_create_gradients(); // Recreate the gradients
      if (redraw_links)
        hl.redraw_prod_links();
      else
        hl.move_prod_links();
    /*
      if (!drawn)
        hl.redraw_prod_links();
      else
        hl.move_prod_links();
      drawn = true;
    */

      // Nodes
      hl.move_prod_nodes();
      hl.resize_nodes_parts();
      // Streams
      hl.move_coll_streams();


      // FORGROUND & AROUND
      hide_black_rect();
      // Arrow stuff
      move_arrow();
      // Axes
      hl.redraw_axises();

     //console.log("use_canvas:", use_canvas, "\nuse_canvas_grid:", use_canvas_grid, "\nMajor redraw Time:", (new Date()).getTime() - start);

  }

  // +-+-+-+-+-+ +-+ +-+-+-+-+-+-+-+-+
  // |S|T|Y|L|E| |&| |T|O|O|L|T|I|P|S|
  // +-+-+-+-+-+ +-+ +-+-+-+-+-+-+-+-+
hl.get_person_html = function(id) {
	var class_decor = (sankey.filters_people()[id].num_hl == sankey.filters_people()[id].num_total)
		? "text_hl" : "";
//num_fl == num_total and still being displayed would not happen!
//	class_decor += (sankey.filters_people()[id].num_fl == sankey.filters_people()[id].num_total)
//		? " text_fl" : "";
	return "<span style=\"background-color:" + people_colour[id % people_colour.length] + "; "
		+ "color:#D5CFD5\" class=\"" + class_decor + "\">" + sankey.people()[id].name + "</span>";
}
  function apply_style_product_link(link) {

      link
      .attr("id", function (d,i) {
        //return sankey.getID(d); })
        return "n" + i; })//d.id; })
      .style("stroke-opacity", function (person, pindex) {
         return sankey.people()[pindex].selected
           ? link_opacity_scale.range()[1] : link_opacity_scale.range()[0];
      })
      // MOD: Use this as stroke-width if we want to expand the link size
      //return Math.max(linkWidth, d.dy); })
      .attr("stroke", link_fill_value)
      .call(hl.setup_highlights)
      ;

  }
  // Tool-tips info from hovering over product icons
  hl.print_icon_title = function(d) {

    var name_string = (typeof d.type != "undefined") ? sankey.legend()[d.type].name
    + " " + "  <img src=\"" + sankey.legend()[d.type].url + "\" alt=\"icon\" class=\"iconic\" />"
    : "Undefined";

    var people_string = "";

    if (d.people.keys().length == 0) people_string = "<p>No contributors</p>";
    else if (d.people.keys().length == 1) people_string = "<p><strong>Contributor:</strong> "
	+ hl.get_person_html(d.people.keys()[0]) + "</p>";
    else {
      people_string = "<p><strong>Contributors:</strong></p><ul>";
      d.people.keys().forEach(function(pindex) {
        people_string += "<li>" + hl.get_person_html(pindex) + "</li>";
      });
      people_string += "</ul>";
    }

    return "<p class=\"heading\"><strong>Product:</strong> (#" + d.id + ") \"" + d.name + "\"</p>"
    + "<p><strong>Description:</strong> " + d.desc + "</p>"
    + "<p><strong>Published:</strong> " + xaxis_format(d.realDate) + "</p>"
    + "<p><strong>Type:</strong> " + name_string + "</p>"
    + people_string;
  };
  hl.collab_title = function(d) {

    var nodes_len = sankey.filters_people()[d.person].num_total
                - sankey.filters_people()[d.person].num_fl;

    return "<p class=\"heading\"><strong>Contributor Stream:</strong> "
	+ hl.get_person_html(d.person) + "</p>"
	+ "<p><strong>Products Shown:</strong> " + nodes_len + "</p>";
  }
  // Tool-tips from hovering over product links (not used if use_canvase=true)
  hl.print_link_title = function(d,i) {

    var nodes_len = sankey.filters_people()[i].num_total
                - sankey.filters_people()[i].num_fl;

    return "<p class=\"heading\"><strong>Contributor Stream:</strong> "
	+ hl.get_person_html(i) + "</p>"
	+ "<p><strong>Products Shown:</strong> " + nodes_len + "</p>";
  };


  // +-+-+-+-+-+
  // |S|e|t|u|p|
  // +-+-+-+-+-+
  // setup highlights
  hl.setup_highlights = function(part) {

    return part
    .on(setting_title_box_stay, hl.lock_title_box_data)
    .on(setting_highlighted_preview, hl.helper_highlight_prod_collab)
    .on(setting_highlighted_preview_off, hl.helper_de_highlight_prod_collab)
    .on(setting_highlighted, hl.helper_highlight_prod_collab)
;


  }
  // Setting up gradients
  hl.helper_create_gradients = function() {

    d3.selectAll("." + gradient_id)
    .remove();
    d3.selectAll("." + pattern_id)
    .remove();

    // STREAMS
    sankey.streams().forEach(function (stream, sindex) {

      var lg = defs.append("linearGradient")
      //   .attr("gradientUnits","userSpaceOnUse") // need for straight lines stroke
      .attr("class", gradient_id)
      .attr("id", gradient_id + stream.person);


      stream.values.forEach(function (bin, bindex) {

        if (bin.y != 0) {
          colour_scales.forEach(function ( scale, sindex) {
            scale.domain([bin.y, 0]);
          });

          var base_colour = d3.rgb(people_colour[stream.person % people_colour.length]);

          var r = base_colour.r;// * bin.groupness / bin.y; //(colour_scales[0](bin.groupness) );
          var g = base_colour.g;// * bin.groupness / bin.y; //(colour_scales[1](bin.groupness) );
          var b = base_colour.b;// * bin.groupness / bin.y; //(colour_scales[2](bin.groupness) );
	  var set_colour = d3.rgb(r,g,b);

          if (sankey.isTypeGroupNeeded()) {
            set_colour = d3.rgb(r,g,b).hsl();
            set_colour.s = bin.groupness / bin.y / 2;
          }

          lg.append("stop")
          .attr("stop-color", set_colour.toString())
          .attr("offset", (sankey.xScale()(bin.date) / sankey.size()[disp_w] * 100) + "%");

        }
      });


      // Set up select pattern
      var height = sankey.yScale()[coll_h](d3.max(stream.values, function (value, vindex) {
        return value.y + value.y0;
      }));


      pattern_select_repeat = sankey.yScale()[coll_h](1) - sankey.yScale()[coll_h](0);
      var pattern_width = sankey.size()[disp_w];

      var pattern_select = defs.append("pattern")
      .attr("id", pattern_id + stream.person)
      .attr("class", pattern_id )
      .attr("x", -linkWidth + "px")
      .attr("y", 0)
      .attr("width", pattern_width/sankey.size()[disp_w])//pattern_select_repeat/sankey.size()[disp_w])
      .attr("height", (height == 0) ? 0 : pattern_select_repeat/height);
      ;
      pattern_select.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", pattern_width)
        .attr("height", pattern_select_repeat)
        .attr("fill", d3.rgb(igc[0], igc[1], igc[2]).brighter(5));


      var margin_between = .4, margin_within = .05;

     pattern_select.append("rect")
        .attr("x", 0)
        .attr("y", pattern_select_repeat * margin_between/2)
        .attr("width", pattern_width)
        .attr("height", pattern_select_repeat - pattern_select_repeat * margin_between/2)
        .attr("fill", function () { return "url(#" + gradient_id + stream.person + ")" });
  });


    //console.log("time_diff:", sankey.bin_size());

    // LINKS
    if (!use_canvas) {
      sankey.links().forEach(function (link, lindex) {

        if (d3.select("linearGradient#n" + link.type_group)[0][0] == null) {
          var lg = defs.append("linearGradient")
          //   .attr("gradientUnits","userSpaceOnUse") // need for straight lines stroke
          .attr("class", gradient_id)
          .attr("id", "n" + link.type_group);

          var group_var = link.type_group.split("_").map(function (some_int) { return parseInt(some_int) });;

          if (group_var[2] != 0) {

            colour_scales.forEach(function ( scale, sindex) { scale.domain([group_var[2], 0]); });

            for (var i = 0; i < 2; i++) {
              lg.append("stop")
              .attr("stop-color", "rgb("
                    +  colour_scales[0](group_var[i]) + ","
                    +  colour_scales[1](group_var[i]) + ","
                    +  colour_scales[2](group_var[i])
                    + ")")
              .attr("offset", i * 100 + "%" );
            }
          }
        }
      });
    }

  };
  // Sets up the rectangle and arrow for actually stretching the chart sideways
  hl.setup_zooming = function() {

    var old_width = sankey.size()[disp_w];
    function dragmove_rect(d) {
      var x = Math.max(d3.event.x, margin.left + arrow_margin);
      x += this.offsetParent.scrollLeft;

      d3.select(this)
      .style("left", x + "px");

	window.scrollTo(x,window.pageYOffset);

      var new_width = Math.max(1, x - margin.left - arrow_margin);
      sankey.size()[disp_w] = new_width;
    }
    var drag_rect = d3.behavior.drag()
    .on("dragstart", function () {
      d3.select(this).attr("class", d3.select(this).style("left"));
    })
    .on("drag", dragmove_rect)
    .on("dragend", function() {
      d3.select(this).attr("class","");
      if (old_width != sankey.size()[disp_w]) {
        sankey.rebreath();
        hl.draw_graph_resize(false);
        hl.printout("HL:setup_zooming", (sankey.size()[disp_w]/old_width) + "x (drag)",
                      true, false);
      }
      old_width = sankey.size()[disp_w];
    });

    arrow.style("left", (sankey.size()[disp_w] + margin.left + arrow_margin) + "px")
    .style("top", margin.top + "px")//(sankey.size()[prod_h] + margin.top - parseInt(arrow.style("height"))/2) + "px")
    .call(drag_rect)
     .on("dblclick", function () {
      sankey.size()[disp_w] = old_width = sankey.size()[disp_w] * 2;
      sankey.rebreath();
      hl.draw_graph_resize(false);
      hl.printout("HL:setup_zooming", "2x (dblclick)", true, false);
    })

    .on ("contextmenu", function () {
      sankey.size()[disp_w] = old_width = sankey.size()[disp_w] / 2;
      sankey.rebreath();
      hl.draw_graph_resize(false);
      hl.printout("HL:setup_zooming", ".5x (contextmenu)", true, false);
    })

    .on(setting_highlighted_preview, function() {
      hl.move_title_box(d3.event, "<p><strong>Resize chart width</strong></p>"
                     + "<hr /><p>"
                     + "<strong>Drag:</strong> Resize width<br />"
                     + "<strong>Double click:</strong> Double width<br />"
                     + "<strong>Right-click:</strong> 1/2 width<br />"
                     + "</p>", "help");
    })
    .on(setting_highlighted_preview_off, hl.hide_title_box);

    var button_path = d3.select("#right_arrow").node();
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
  // Set up canvas for links
  hl.setup_canvas = function() {

    // Grid
    canvas_axis = document.getElementById('canvas_axis').getContext('2d');

    // Links
    // Add canvas for links
    var canvases = d3.select("div#canvases")
    .selectAll("canvas." + canvas_person_id)
    .data(sankey.people())
    .enter()
    .append("canvas")
    .attr("class", canvas_person_id)
    .attr("id", function (d, i) { return canvas_person_id + i });

    sankey.people().forEach(function (link, pindex) {
      canvas_people.push(document.getElementById(canvas_person_id + pindex).getContext('2d'));
    });

    // foreground = document.getElementById('foreground').getContext('2d');
    //background = document.getElementById('background').getContext('2d');


    d3.selectAll("canvas")
    .attr("width", sankey.size()[disp_w])
    .attr("height", sankey.size()[prod_h] + sankey.size()[coll_h])
    .style("top", margin.top + "px")
    .style("left", margin.left + "px");
  }
  // Initualizing grid
  hl.init_grid = function () {

    if (!use_canvas_grid) {

      // GRIDS
      // Dates
      svg.append("g").attr("class", "x grid");
      // Product yAxis
      svg.append("g").attr("class", "y grid " + setup_prod);
      // Collab yAxis
      svg.append("g").attr("class", "y grid " + setup_coll);
      //Shading rectangle for re-sizing
      svg.append("rect")
      .attr("id","resize_drawn")
      .style("fill","black")
      .style("opacity", 0.4)
      ;
    }

    return hl;
  }
  // Axis Stuff
  // Grid lines + axis settings
  function make_x_axis() {
    return d3.svg.axis().scale(sankey.xScale())
    .orient("bottom")
    .tickValues(sankey.xTicks())
    .tickFormat(isSmall ? xaxis_format_sm : xaxis_format);
  }
  function make_y_axis(sindex) {
    var b = Math.ceil(d3.max(sankey.yScale()[sindex].domain()));
    var a = Math.ceil(d3.min(sankey.yScale()[sindex].domain()));
    var ticks = d3.range(a, b, 1);
    return d3.svg.axis().scale(sankey.yScale()[sindex])
    .orient("left")
    .tickValues(ticks);
  }
  // Initualizing values (e.g., link shading, product increments...)
  hl.init_values = function () {

      /*
      // Set the increment of things
      var curr = product_colour;
      var counter = 0;
      while (curr.match(/#[0-2].[0-2].[0-2]./) == null) {
        curr = d3.rgb(product_colour).darker(counter * product_step).toString();
        counter++;
      }*/

      var counter = 9; // Stes in product_step until total darkness!
      var max_overlap = 0.5;
      product_step = Math.max(0.01, counter * product_step * max_overlap / sankey.max_collabs());
      max_overlap = 1.00;
      var new_range = Math.max(0.1,
                            max_overlap / sankey.max_collabs());
        //Math.min(max_overlap / sankey.yScale()[prod_h].domain()[1], max_overlap / sankey.max_collabs()));
      link_opacity_scale.range([new_range, 1]);

      return hl;
    }
  // Main initualization of chart
  hl.initualize = function () {

    // Save original settings (for "Restart Sizes")
    originally.width = sankey.size()[disp_w];
    originally.num_breath = num_breath;
    originally.nodeWidth = nodeWidth;

    // Tooltip & Black box
    title_box = d3.select("#title_box")
	.attr("title", "Collapse")
	.on("click", function () {
		title_box_locked = false;
		hl.hide_title_box();
	});
    svg.append("rect")
      .attr("id","resize_drawn")
      .style("fill","black")
      .style("opacity", 0.4);

    // MAIN CHART STUFF
    // Streams
    var stream = svg.append("g")
        .attr("class",streams_class)
        .selectAll("." + stream_class)
        .data(sankey.streams())
      .enter().append("path")
        .attr("class", stream_class + " chart_context_menu")
        .attr("id", function(d) { return "n" + d.person })
        .style("stroke-width", linkWidth/2)
        .attr("fill", stream_fill_value)
	      .style("stroke", stream_link_fill_value)
        .call(hl.setup_highlights);
    // Links (most is done in draw graph resize)
    products_group = svg.append("g")
      .attr("class", products_class);
    // Nodes
    var node = products_group.append("g")       // Grouping
        .selectAll(".node")
        .data(sankey.nodes())
      .enter().append("g")
        .attr("class", "node");
    node.append("rect")                         // Rectangle
      .attr("id", function (d) { return "n" + d.id; })
      .attr("class","chart_context_menu")
      .attr("height", function(d) { return d.x; })
      .attr("width", function(d) { return d.y; })
      .attr("fill", hl.sort_out_node_fill)
      .style("stroke", hl.sort_out_node_stroke)
      .call(hl.setup_highlights);
    node.append("image") // Image
      .attr("class","chart_context_menu")
      .attr("xlink:href", function(d) { return (typeof d.type != "undefined")
          ? sankey.legend()[d.type].url : ""; })
      .call(hl.setup_highlights);
/*
    node.append("text")                          // Labels
      .attr("x", -6)
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .attr("transform", null)
      .text(function(d,i) { return i })
      .attr("x", function(d) { return d.dx + 6; })
      .attr("text-anchor", "start");
*/
    // AXISES
    // Dates
    svg.append("g")
      .attr("class", "x axis")
      .selectAll("text")
      .attr("class","axis-labels")
      .attr("dy", ".35em")
      .attr("transform", "translate(5,9)rotate(65)")
      .style("text-anchor", "start");
    // yAxis Product
    yaxis_g.append("g")
      .attr("class", "y axis " + setup_prod);
    // yAxis Collabs
    yaxis_g.append("g")
      .attr("class", "y axis " + setup_coll)
      .attr("transform", "translate(0," + sankey.size()[prod_h] + ")");

    // Move to correct positions
    hl.draw_graph_resize(true);
    return hl;
  }
  // Set the originally values as the main values to restart this thing
  hl.restart = function() {

    sankey.size()[disp_w] = originally.width;
    num_breath = originally.num_breath;
    nodeWidth = originally.nodeWidth;

    resize_bins();
    hl.printout("NAV:restart", "Restart_Sizes", true, false);

  }

  hl.printout = function(origin, key, print_chart_dim_offset, print_chart_values) {
     if (DUMP) {

         var output_lines = [new Date() + "\t" + origin + "\t" + key + "\t", file_name];
         if (print_chart_dim_offset) {
           output_lines.push("print_chart_dim_offset");
           output_lines.push("chart:" + sankey.size()[disp_w] + "x"
              + (sankey.size()[prod_h] + sankey.size()[coll_h]));
           /*
           var left_part = parseInt(yaxis_svg.style("left")) + parseInt(yaxis_svg.style("width"));

           console.log("LEFT:", left_part, window.scrollX, sankey.size()[disp_w]);

           output_lines.push("chart_offset:" + (window.scrollX - 10) + "x" + (window.scrollY - 28));
           output_lines.push("chart_seen:"
              + Math.min(window.innerWidth - left_part - (window.scrollX - 10) - 10,
                         sankey.size()[disp_w])
              + "x"
              + Math.min(window.innerHeight - (window.scrollY - 28),
                         (sankey.size()[prod_h] + sankey.size()[coll_h])));
             */
           output_lines.push("window:" + window.innerWidth + "x" + window.innerHeight);
           output_lines.push("window_offset:" + window.scrollX + "x" + window.scrollY);
           output_lines.push("sankey_num_breath:" + sankey.num_breath());
           output_lines.push("sankey_nodeWidth:" + sankey.nodeWidth());
         }
         if (print_chart_values) {
           output_lines.push("print_chart_values");
           output_lines.push("x-values:" + sankey.xTicks()[0] + "-" + sankey.xTicks()[1]
                             + " (" + sankey.xTicks().length + ")");
           output_lines.push("yProd-values:" + sankey.yScale()[prod_h].domain()[1]
                             + "-" + sankey.yScale()[prod_h].domain()[0]);
           output_lines.push("yColl-values:" + sankey.yScale()[coll_h].domain()[1]
                             + "-" + sankey.yScale()[coll_h].domain()[0]);
         }

        output_lines = output_lines.join("\t");
        window.dump(output_lines + "\n");
      }
  }




  return hl;
};
