
var width = 960*4,
    height = 480*4;

var projection = d3.geo.equirectangular()
    .scale(153*4)
    .translate([width / 2, height / 2])
    .precision(.1);

var path = d3.geo.path()
    .projection(projection);

var graticule = d3.geo.graticule();

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

d3.json("world-50m.json", function(error, world) {
    if (error) throw error;

    svg.insert("path", ".graticule")
        .datum(topojson.feature(world, world.objects.land))
        .attr("class", "land")
        .attr("d", path);

    svg.insert("path", ".graticule")
        .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
        .attr("class", "boundary")
        .attr("d", path);
});

d3.select(self.frameElement).style("height", height + "px");

var places = d3.csv("geolocation.csv", function(d) {
    return {
        latitude: +d.latitude,
        longitude: +d.longitude
    };

}, function(error, rows) {
    places = rows;
    plotDots();
});

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
        return "<span style='color:red'>latitude: " + d.latitude + " longitude: " + d.longitude + "</span>";
    });
svg.call(tip);


function plotDots() {
    svg.selectAll(".pin")
        .data(places)
        .enter().append("circle", ".pin")
        .attr("r", 1)
        .style("fill", "red")
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
        .attr("transform", function(d) {
            return "translate(" + projection([
                    d.longitude,
                    d.latitude
                ]) + ")";
        });
}




