import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import numeral from 'numeral'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            }
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    TooltipFormat: 'll',
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    //include a dollar sign in the ticks
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

const buildChartData = (data, casesType = 'cases') => {
    const chartData = [];
    let lastDataPoint;
    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = { 
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
}
 
function LineGraph({ casesType, ...props }) {
    const [data, setData] = useState({})
    //https:..../v3/covid-19/historical/all?lastdays=120
   
    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
            .then((response) => {
                return response.json();
            })
            .then(data => {
                // clever stuff here
                //console.log(data)
                let chartData = buildChartData(data, casesType);
                setData(chartData)
            })
        }
        fetchData();
        
    }, [casesType])

    return (
        <div className={props.className}>
            {data?.length > 0 && (  // set a condition 
               <Line
                    data={
                        {
                            datasets: [
                                {
                                    label: 'New cases',
                                    backgroundColor: "rgba(204, 16, 52, 0.5)",
                                    borderColor: "#CC1034",
                                    data: data  // the value data of usestate
                                }    
                            ]
                        } 
                    }
                    options={options}
                /> 
            )}
        </div>
    )
}

export default LineGraph
