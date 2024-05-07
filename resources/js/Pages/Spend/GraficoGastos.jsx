import React from 'react'
import { useState, useEffect } from 'react';
import EChartsReact from "echarts-for-react";
import GlobalFunctions from '../services/GlobalFunctions'

const GraficoGastos = (params) => {
    const glob = new GlobalFunctions()
    const [datos, setDatos] = useState({
        title: {
            text: "",
            subtext: "",
            left: "center"
        },
        tooltip: {
            trigger: "item"
        },
        legend: {
            orient: "vertical",
            left: "right",
        },
        series: [
            {
                name: "",
                type: "pie",
                radius: "80%",
                data: [],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: "rgba(0, 0, 0, 0.5)"
                    }
                }
            }
        ]
    })

    useEffect(() => {
        if (params.datosGrafico.length != datos.series[0].data.length) {
            cargar()
        }

    })

    function cargar() {
        setDatos({
            title: {
                text: "",
                subtext: "",
                left: "center"
            },
            tooltip: {
                trigger: "item"
            },
            legend: {
                orient: "vertical",
                left: "right",
                show: true
            },
            series: [
                {
                    name: "",
                    type: "pie",
                    radius: "80%",
                    data: params.datosGrafico,
                    label: {
                        show: true,
                        formatter: function(param) { return param.name + ': $'+glob.formatNumber(param.value) },
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: "rgba(0, 0, 0, 0.5)"
                        }
                    }
                }
            ]
        })
    }
   
    return (
        <div>
            {datos.series[0].data.length > 0 ?
                <EChartsReact option={datos} />
                : ''
            }
        </div>
    )
}

export default GraficoGastos