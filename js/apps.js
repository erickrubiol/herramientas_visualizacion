
// Definir el tamaño de la gráfica
const relleno = 60;
const w = 800;
const h = 520;

// Limites de los ejes X, Y
const minLargo = 1980;
const maxLargo = 2015;
const minAlto = 0;
const maxAlto = 700;


// Cargar los datos desde el archivo csv (asociacion)
d3.csv('../data/data.csv', function (d) {
    return [
        +d['Ano'],
        +d['Total'],
        +d['Norteamerica'],
        +d['Europe']
    ]
}).then(plot_data);


// Funciona principal que genera la gráfica
function plot_data(data) {

  // Definir las escalas de los ejes
  const xScale = d3.scaleLinear()
    .domain([minLargo, maxLargo])
    .range([relleno, w - relleno]);

  const yScale = d3.scaleLinear()
    .domain([minAlto, maxAlto])
    .range([h - relleno, relleno]);


  // Limitar los datos para que nunca excedan al eje X
  let rango_datos = [];
  data.forEach(function (e) {
      if (e[0] >= minLargo && e[0] <= maxLargo) {
          rango_datos.push(e);
      }
  });

// Fijar la ventana SVG 
  const svg = d3.select('#grafico_1')
              .append('svg')
              .attr('width', w)
              .attr('height', h);

// Gràfica de datos principal
  svg.append('path')
  .datum(rango_datos)
  .attr('stroke', 'SkyBlue')
  .attr('stroke-width', 4)
  .attr('fill', 'none')
  .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y(yScale(0)))
  // Animacion inicial
  .transition()
  .duration(2300)
  .attr('d', d3.line()
                  .x((d) => xScale(d[0]))
                  .y((d) => yScale(d[1])));



 // Etiquetas de la serie de datos  
  svg.selectAll('circle_samp_1')
     .data(rango_datos)
     .enter()
     // Circulo que indica el punto de datos seleccionado
     .append('circle')
     .attr('cx', (d) => xScale(d[0]))
     .attr('cy', (d) => yScale(d[1]))
     .attr('r', 5)
     .attr('fill', 'SkyBlue')
     .attr('class', 'points')
     .style('pointer-events', 'all')
     .append('title')
     // Texto de la Etiqueta 
     .text(function (d) {
         return (
          'Año: ' + d[0] + '\n' + 'Ventas (millones): ' + d[1]
         );
     });



// Etiqueta de la serie de datos
  //Linea
  svg.append('path')
     .datum([[1986, 500], [1989, 500]])
     .attr('stroke', 'SkyBlue')
     .attr('stroke-width', 6)
     .attr('d', d3.line()
             .x((d) => xScale(d[0]))
             .y((d) => yScale(d[1])));

  svg.append('text')
     .attr('x', xScale(1990))
     .attr('y', yScale(500))
     .attr('alignment-baseline', 'central')
     .style('font-family', 'sans-serif')
     .style('font-size', '16px')
     .text('Piezas vendidas');




// Configuracion del eje horizontal (X)
  // Eje serie X
  svg.append('g')
  .style('font-size', '12px')
  .attr('transform', 'translate(0,' + (h - relleno) + ')')
  .call(d3.axisBottom(xScale).tickFormat(d3.format("")));

  // Texto serie X
  svg.append('text')
     .attr('x', w/2) // centrar la etiqueta
     .attr('y', h - 20) // Altura de la etiqueta vs margen inferior
     .attr('text-anchor', 'middle')
     .style('font-family', 'sans-serif')
     .text('Año');


// Configuracion del eje vertical (Y)
  // Eje Serie Y
  svg.append('g')
  .style('font-size', '12px')
  .attr('transform', 'translate(' + relleno + ',0)')
  .call(d3.axisLeft(yScale));

  // Texto serie Y
  svg.append('text')
     .attr('text-anchor', 'middle')
     .attr('transform', 'translate(15,' + h/2 + ')rotate(-90)') // centrar y poner vertical
     .style('font-family', 'sans-serif')
     .text('Millones de unidades');
}
