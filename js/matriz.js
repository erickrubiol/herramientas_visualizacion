// set the dimensions and margins of the graph
var margin = {top: 85, right: 25, bottom: 30, left: 100},
  ancho = 850 - margin.left - margin.right,
  altura = 450 - margin.top - margin.bottom;

// Caracteristicas del objeto que se incrusta en la página (svg)
var svg = d3.select("#div_template")
.append("svg")
  .attr("width", ancho + margin.left + margin.right)
  .attr("height", altura + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Cargar los datos desde el archivo csv (asociacion)
d3.csv("../data/data2.csv", function(data) {

  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var serieAno = d3.map(data, function(d){return d.group;}).keys()
  var serieGenero = d3.map(data, function(d){return d.variable;}).keys()

  // Eje horizontal (x)
  var x = d3.scaleBand()
    .range([ 0, ancho ])
    .domain(serieAno)
    .padding(0.05);
  svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + altura + ")")
    .transition()
      .duration(2000)
      .call(d3.axisBottom(x).tickSize(0))
      .select(".domain").remove()
      .attr("transform", "translate(0," + altura + ")")

  // Eje Vertical (y)
  var y = d3.scaleBand()
    .range([ altura, 0 ])
    .domain(serieGenero)
    .padding(0.05);
  svg.append("g")
      .transition()
      .duration(2000)
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  // Rango de colores para la matriz
  // el código de la escala ha sido inspirado en los snippets que aparecen en http://using-d3js.com/04_05_sequential_scales.html
  var colorGradiente = d3.scaleLinear()
  .range(["lightsalmon", "white", "green"])
  .domain([4.5, 7, 9.5])

  // Etiqueta de datos de la matriz
  var Etiqueta = d3.select("#div_template")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "whitesmoke")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "1px")

  // Funciones para identificar que hace el usuario con su cursor
  var cursorFuera = function(d) {
    Etiqueta
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }
  var cursorEncima = function(d) {
    Etiqueta
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "gold")
      .style("opacity", 1)
  }
  var mouseCambio = function(d) {
    Etiqueta
      .html("Calificación: " + d.value)
      .style("left", (d3.mouse(this)[0]) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // Funciona principal que genera la gráfica
  svg.selectAll()
    .data(data, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return colorGradiente(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)

    .on("mouseover", cursorEncima)
    .on("mousemove", mouseCambio)
    .on("mouseleave", cursorFuera)
})