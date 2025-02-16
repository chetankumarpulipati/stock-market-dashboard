import React, { useRef, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

function StockOverview({ stockData, investedValue, totalReturns }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            // Perform any operations with chartRef here
        }
    }, [stockData]);

    const data = {
        labels: stockData.map(item => item.date),
        datasets: [
            {
                label: 'Stock Price',
                data: stockData.map(item => item.close),
                fill: false,
                backgroundColor: 'blue',
                borderColor: 'blue',
            },
        ],
    };

    return (
        <div className="overview">
            <main>
                <p style={{ fontWeight: 'bold' }}>Total Investment</p>
                <span style={{ display: 'flex', justifyContent: 'space-evenly', fontWeight: 'bold' }}>
                    <p>Invested Value</p>
                    <p>Total Returns</p>
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    <p>${investedValue}</p>
                    <p>${totalReturns}</p>
                </div>
                <Line ref={chartRef} data={data} />
            </main>
        </div>
    );
}

export default StockOverview;