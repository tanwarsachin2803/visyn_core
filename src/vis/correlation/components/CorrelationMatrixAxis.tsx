import * as React from 'react';
import * as d3 from 'd3v7';
import { useMantineTheme } from '@mantine/core';

export function Grid({ width, height, names }: { width: number; height: number; names: string[] }) {
  const theme = useMantineTheme();
  const borderColor = theme.colors.gray[4];

  const xstep = width / names.length;
  const ystep = height / names.length;

  return (
    <>
      {Array.from({ length: names.length + 1 }).map((_, i) => {
        const x = xstep * i;
        const y = ystep * i;

        const xtick = x + xstep / 2;
        const ytick = y + ystep / 2;

        return (
          <g key={x}>
            {i !== names.length ? (
              <g transform={`translate(${xtick}, -10)`}>
                <text x={0} y={0} textAnchor="end" transform="rotate(45)">
                  {names[i]}
                </text>
              </g>
            ) : null}
            {i !== names.length ? (
              <g transform={`translate(-10, ${ytick})`}>
                <text x={0} y={0} textAnchor="end" transform="rotate(45)">
                  {names[i]}
                </text>
              </g>
            ) : null}
            <line x1={x} x2={x} y1={0} y2={height} stroke={borderColor} />
            <line x1={0} x2={width} y1={y} y2={y} stroke={borderColor} />
          </g>
        );
      })}
    </>
  );
}

export function AxisTop({ xScale, ticks, height }: { xScale: d3.ScaleBand<string>; ticks: { value: string; offset: number }[]; height: number }) {
  const theme = useMantineTheme();
  const borderColor = theme.colors.gray[4];
  if (!xScale || !ticks) return null;

  return (
    <>
      {ticks.map(({ value, offset }) => {
        const x = xScale(value);

        return (
          <g key={value}>
            <line x1={x} x2={x} y2={height} stroke={borderColor} />
          </g>
        );
      })}
    </>
  );
}

export function AxisLeft({ yScale, ticks, width }: { yScale: d3.ScaleBand<string>; ticks: { value: string; offset: number }[]; width: number }) {
  const theme = useMantineTheme();
  const borderColor = theme.colors.gray[4];

  if (!yScale || !ticks) return null;

  return (
    <>
      {ticks.map(({ value, offset }) => {
        const y = yScale(value) + yScale.bandwidth() / 2;

        return (
          <g key={value}>
            <line y1={y + yScale.bandwidth() / 2} y2={y + yScale.bandwidth() / 2} x2={width} stroke={borderColor} />
          </g>
        );
      })}
    </>
  );
}
