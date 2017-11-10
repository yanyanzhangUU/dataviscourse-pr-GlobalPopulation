
class YearChart {

    constructor () {
        this.margin = {top: 10, right: 20, bottom: 30, left: 50};
        let divyearChart = d3.select("#year-chart");
        this.svgBounds = divyearChart.node().getBoundingClientRect();
        this.svgWidth = this.svgBounds.width - this.margin.left - this.margin.right;
        this.svgHeight = 100;
        this.svg = divyearChart.append("svg")
            .attr("width", this.svgWidth)
            .attr("height", this.svgHeight);
	
    }


    update () {
	let yearChartHeight=this.svgHeight;
	let yearC=this;
	let yearCmargin=30;
	
	let yearChartScale=d3.scaleLinear()
		.domain([1960, 2016])
		.range([yearCmargin,this.svgWidth-yearCmargin]);
	let yearlist=[];
	let year5=[];
	for(let i =1960; i<2017; i++)
	    yearlist.push(i);
	for (let i =0; i<12; i++)
	    year5.push(1960+5*i);
	let elem = this.svg.selectAll("svg")
		.data(yearlist);
	
	elem.enter()
	    .append("circle")
	    .attr("cx", function(d){
		return yearChartScale(d);		
	    })
	    .attr("cy",yearChartHeight/3)
	    .attr("r", function(d){
		if(d%5==0)
		    return 6;
		else
		    return 3;
	    })
	    .attr("fill",  function(d){
		if(d%5==0)
		    return  "#a50f15";
		else
		    return "gray";
	    });
	
	let yeartext= this.svg.selectAll("svg")
		.data(year5);
	yeartext.enter().append("text")
	    .text(function(d){return d;})
	    .attr("dx", function(d){
		return yearChartScale(d);		
	    })
	    .attr("dy", 60)
	    .style("text-anchor", "middle");
	let yearChart= this;
	let ychv= this.svg.selectAll("circle");
	ychv.on("mouseover", function(d){
	    d3.select(this).classed("highlighted", true);
	    let sy=this["__data__"];
	    if(sy%5 !=0){
		yeartext.enter().append("text")
		    .text(sy)
		    .attr("dx", function(d){
			return yearChartScale(sy);		
		    })
		    .attr("dy", 20)
		    .style("text-anchor", "middle")
		    .style("fill","gray")
		    .attr("class","Hoveryear");
	    };

	});
	ychv.on("mouseout", function(d){
	    d3.select(this).classed("highlighted", false);
	    let hy =yearChart.svg.selectAll(".Hoveryear");
	    hy.remove();
	    
	});

	ychv.on("click", function(d){
	    ychv.classed("selected", false);
	    d3.select(this).classed("selected", true);
	    let sy=this["__data__"];
	    console.log(sy)
	});

    }

};
