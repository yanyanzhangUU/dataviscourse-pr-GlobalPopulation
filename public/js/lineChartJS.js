// create the line chart
class LineChartCL {

    constructor (){
        this.margin = {top: 10, right: 10, bottom: 10, left: 10};

        let lines = d3.select("#lineChartsvg").classed("fullView", true);
        // let lines = d3.select("#lineChart");

        //fetch the svg bounds
        this.svgBounds = lines.node().getBoundingClientRect();

        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = this.svgBounds.height - this.margin.top - this.margin.bottom;
        // console.log("bound ", this.svgBounds, this.svgWidth, this.svgHeight);

        // let lineShift = 0.1*this.svgWidth;
        this.svg = d3.select("#lineChart"); //.attr("transform", "translate=("+lineShift+", 0)");

    }

    clearChart() {
        this.svg.selectAll('.service').remove();
        this.svg.selectAll('.axis').remove();
    }

    tooltip_render (tooltip_data) {
        let text = "<br> <b> " + tooltip_data.name +  "</b>" +"<ul>"; // +"<ul> <li class="+"title"+"> " + " " + "</li>";
        tooltip_data.result.forEach((row)=>{
            // text += "<li class = " + this.chooseClass(row.party)+ ">" + row.nominee+":\t\t"+row.votecount+"("+row.percentage+")" + "</li>"
            text += "<li>" + row.year + ":\t\t" + (row.ratio).toFixed(0) + "%</li>";
        });

        return text;
    }

    // draw the lines
    drawLines(data) {
        // this.clearChart;
        let that = this;
        let textWidth = 30;

        // calculate the max and min of the y axis value
        let ymin = 100000000;
        let ymax = 0;
        let yearlist = [];
        data.forEach(function (r) {
            for (let year=1960; year<=2015; year++) {
                yearlist.push(year);
                let currentVal = +r[year+" [YR"+year+']'];
                if (currentVal > ymax) {
                    ymax = currentVal;
                }
                if (currentVal < ymin) {
                    ymin = currentVal;
                }
            }
        });
        console.log("ymin max ", ymin, ymax, ", x range: ", textWidth, this.svgWidth, ", y range: ", this.svgHeight, this.margin.top);

        let xx = d3.scalePoint().domain(yearlist).range([textWidth, this.svgWidth]),
            y = d3.scaleLinear().domain([ymin, ymax]).range([this.svgHeight+this.margin.top, this.margin.top]),
            z = d3.scaleOrdinal(d3.schemeCategory20);

        console.log("scale x ", xx(1960), xx(1961));

        let linefcn = d3.line()
            .x(function(d) {console.log("qcx ", d.year, xx(d.year));  return xx(d.year); })
            .y(function(d) {console.log("qcy ", d.val, y(d.val)); return y(d.val); });

        // id is the column name, i.e. service name
        let valData = [];
        data.forEach(function(r) {
            let valArray = [];
            for (let year = 1960; year <= 2015; year++) {
                let currentVal = +r[year + " [YR" + year + ']'];
                valArray.push({'year': year, 'val': currentVal});
            }

            valData.push({
                name: r['Country Name'],
                id: r['Country Code'],
                values: valArray
            });
        });

        console.log("prepared data ", valData);

        z.domain(valData.map(function(s) { return s.id; }));

        // Create the axes (hint: use #xAxis and #yAxis)
        let xAxis=d3.axisBottom();
        xAxis.scale(xx);
        let xshift = 30;
        let selection=d3.select('#xAxis')
            .classed("axis",true)
            .attr("transform","translate("+xshift+","+(this.svgHeight+this.margin.bottom)+")")
            .attr("id","xAxis text")
            .call(xAxis)
            .selectAll('text')
            .style("text-anchor", "left");

        let yAxis=d3.axisLeft();
        yAxis.scale(y);
        let yAxisxshift = 50;
        let selecty=d3.select('#yAxis')
            .classed("axis",true)
            .attr("transform","translate("+(this.margin.left+yAxisxshift)+","+this.margin.bottom+")")
            .attr("id","yAxis text")
            .call(yAxis);

        let lines = this.svg.selectAll("path")
            .data(valData);
        let linesEnter = lines.enter().append("path");
            // .attr("class", "lines");
        lines.exit().remove();
        lines = lines.merge(linesEnter);

        lines.attr("class", d => d.id + " lines")
            .attr("d", function(d) {console.log("d? ", d.values);  return linefcn(d.values); })
            .style("stroke", function(d) { return z(d.id); });

        let tip = d3.tip().attr('class', 'd3-tip')
            .direction('s')
            .offset(function() {
                return [0,0];
            })
            .html(d => d.name);
            // {
            //     let tooltip_data = {
            //         "name": d.name
                    // "result": d.values.map(function(r) {
                    //     return {year: r.year, ratio: r.ratio};
                    // })
                // };

                // return that.tooltip_render(tooltip_data);
            // });

        // to do: to be added. small rectangles on each line
        // service.selectAll('rect')
        //     .attr("x", )
        //     .style();

        lines.call(tip);
        lines.on("mouseover", tip.show)
            .on("mouseout", tip.hide);

        let bigsvg = d3.select('#textLabels');
        let labels = bigsvg.selectAll(".textlabels")
            .data(valData);
        let labelsEnter = labels.enter().append("li")
            .attr("class", "serviceLabels");
        labels.exit().remove();
        labels = labels.merge(labelsEnter);
        // text/lables. class name consistent with path/rects classes
        labels.text(function(d) { return d.name; })
            .attr("class", d => d.id + " title textlabels")
            .style("color", function(d) { return z(d.id); });

        // let infoPanel = new infoChart();
        // labels.on("click", function (d) {
        //     d3.selectAll(".highlighted").classed("highlighted", false);
        //     d3.selectAll("." + d.id.replace(/\s+/g, '')).classed("highlighted", true);
        //     infoPanel.updateInfo(tabledata, d.id);
        // })
        //     .on("dblclick", function (d) {
        //         d3.selectAll(".highlighted").classed("highlighted", false);
        //         d3.select("#infoPanel").selectAll("li").remove();
        //     });

    }

}