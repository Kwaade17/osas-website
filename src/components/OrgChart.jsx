import { useCallback, useEffect, useRef } from "react";
import { OrgChart } from "d3-org-chart";
import {
  docLarnie,
  docMaylin,
  maamLenbert,
  maamMichai,
  sirElven,
  sirHerbert,
  sirJodell,
  sirLau,
  sirSean,
} from "../assets/profileImg";

const CHART_HEIGHT = 650;
const ROOT_ID = "osas-org-chart-root";

const osasOrgData = {
  name: "Larnie Sam A. Tabuena, PhD",
  title: "College President",
  image: docLarnie,
  children: [
    {
      name: "Maylin M. Tongcua, PhD",
      title: "OIC - VP for Academic Affairs",
      image: docMaylin,
      children: [
        {
          name: "Laurence M. Lachica, MPA",
          title: "Head, OSAS",
          image: sirLau,
          children: [
            {
              name: "Elven Jude Cabalinan, MLIS",
              title: "College Librarian",
              image: sirElven,
              children: [],
            },
            {
              name: "To Be Announced",
              title: "TCV Adviser",
              image: "https://ui-avatars.com/api/?name=To+Be+Announce&background=064e3b&color=fff&size=128",
              children: [],
            },
            {
              name: "Herbert C. Donguines, MAEd",
              title: "SSC Adviser",
              image: sirHerbert,
              children: [],
            },
            {
              name: "OSAS Staff",
              isLabelNode: true,
              children: [
                {
                  name: "Jodell T. Vibal",
                  title: "OSAS Staff",
                  image: sirJodell,
                  children: [
                    {
                      name: "Michelle Anne M. Niere",
                      title: "OSAS Staff",
                      image: maamMichai,
                      children: [],
                    },
                  ],
                },
                {
                  name: "Lenbert C. Frias",
                  title: "OSAS Staff",
                  image: maamLenbert,
                  children: [],
                },
              ],
            },
            {
              name: "Sean David C. Calumbiran, LPT",
              title: "CORE Coordinator",
              image: sirSean,
              children: [],
            },
            {
              name: "Reym Nicole C. Gonzales, MAEd",
              title: "Sports Coordinator",
              image: "https://ui-avatars.com/api/?name=Reym+Catalan+Gonzales&background=10b981&color=fff&size=128",
              children: [],
            },
            {
              name: "Aileen P. Balbon",
              title: "NSTP Coordinator",
              image: "https://ui-avatars.com/api/?name=Aileen+Balbon&background=10b981&color=fff&size=128",
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function flattenOrgTree(node, parentId = null, lineage = []) {
  const safeName = slugify(node.name || "node");
  const id = parentId ? [...lineage, safeName].join("-") : `${ROOT_ID}-${safeName}`;

  const flatNode = {
    ...node,
    id,
    parentId,
  };

  const children = node.children || [];
  return [
    flatNode,
    ...children.flatMap((child, index) =>
      flattenOrgTree(child, id, [...lineage, safeName, String(index)])
    ),
  ];
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderNodeHtml(node) {
  if (node.isLabelNode) {
    return `
      <div style="
        min-width: 220px;
        padding: 14px 18px;
        border-radius: 18px;
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0f766e 100%);
        color: #ffffff;
        border: 1px solid rgba(148, 163, 184, 0.3);
        box-shadow: 0 18px 34px rgba(15, 23, 42, 0.18);
        text-align: center;
        letter-spacing: 0.12em;
        text-transform: uppercase;
      ">
        <div style="font-size: 0.72rem; font-weight: 800; line-height: 1.2;">
          ${escapeHtml(node.name)}
        </div>
      </div>
    `;
  }

  return `
    <div style="
      width: 250px;
      padding: 18px 18px 16px;
      border-radius: 24px;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.98));
      border: 1px solid rgba(226, 232, 240, 0.95);
      box-shadow: 0 18px 42px rgba(15, 23, 42, 0.12);
      text-align: center;
      backdrop-filter: blur(8px);
    ">
      <div style="
        width: 96px;
        height: 96px;
        margin: 0 auto 14px;
        border-radius: 9999px;
        overflow: hidden;
        border: 4px solid #ecfdf5;
        background: #f8fafc;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
      ">
        <img
          src="${node.image || ""}"
          alt="${escapeHtml(node.name)}"
          style="width: 100%; height: 100%; object-fit: cover; display: block;"
        />
      </div>
      <div style="font-size: 0.95rem; font-weight: 800; color: #0f172a; line-height: 1.25;">
        ${escapeHtml(node.name)}
      </div>
      <div style="margin-top: 6px; font-size: 0.78rem; font-weight: 700; color: #047857; line-height: 1.35;">
        ${escapeHtml(node.title)}
      </div>
    </div>
  `;
}

const osasChartData = flattenOrgTree(osasOrgData);

export default function OrganizationChart() {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const fitTimerRef = useRef(null);

  const scheduleFit = useCallback((animate = false) => {
    if (fitTimerRef.current) {
      window.cancelAnimationFrame(fitTimerRef.current);
      fitTimerRef.current = null;
    }

    fitTimerRef.current = window.requestAnimationFrame(() => {
      fitTimerRef.current = window.requestAnimationFrame(() => {
        chartRef.current?.fit({ animate });
      });
    });
  }, []);

  const renderChart = useCallback((animate = false) => {
    const container = chartContainerRef.current;
    const chart = chartRef.current;

    if (!container || !chart) {
      return;
    }

    const { width, height } = container.getBoundingClientRect();
    if (width <= 0 || height <= 0) {
      return;
    }

    chart.svgWidth(width).svgHeight(height).render();
    scheduleFit(animate);
  }, [scheduleFit]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) {
      return undefined;
    }

    const preventWheelZoom = (event) => {
      event.stopPropagation();
    };

    container.addEventListener("wheel", preventWheelZoom, { passive: true });

    const chart = new OrgChart();
    chartRef.current = chart;

    chart
      .container(container)
      .data(osasChartData)
      .nodeId((node) => node.id)
      .parentNodeId((node) => node.parentId)
      .initialExpandLevel(6)
      .rootMargin(40)
      .layout("top")
      .duration(350)
      .scaleExtent([0.25, 2.5])
      .nodeWidth((node) => (node.data.isLabelNode ? 240 : 250))
      .nodeHeight((node) => (node.data.isLabelNode ? 84 : 172))
      .siblingsMargin(() => 24)
      .childrenMargin(() => 54)
      .neighbourMargin(() => 32)
      .linkYOffset(20)
      .nodeContent((node) => renderNodeHtml(node.data))
      .render();

    scheduleFit(false);

    if (typeof ResizeObserver === "undefined") {
      return () => {
        container.removeEventListener("wheel", preventWheelZoom);
        if (fitTimerRef.current) {
          window.cancelAnimationFrame(fitTimerRef.current);
        }
        chartRef.current = null;
        container.innerHTML = "";
      };
    }

    const observer = new ResizeObserver(() => {
      renderChart(false);
    });

    observer.observe(container);

    return () => {
      observer.disconnect();
      container.removeEventListener("wheel", preventWheelZoom);
      if (fitTimerRef.current) {
        window.cancelAnimationFrame(fitTimerRef.current);
      }
      chartRef.current = null;
      container.innerHTML = "";
    };
  }, [renderChart, scheduleFit]);

  return (
    <div id="organizational-structure" className="w-full my-12 flex flex-col items-center scroll-mt-24">
      <div className="mb-6 max-w-2xl text-center">
        <h2 className="mt-4 text-3xl font-black text-slate-900 sm:text-4xl">
          Organizational Structure
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Drag to move around. Scroll or pinch to zoom.
        </p>
      </div>

      <div className="relative w-full max-w-6xl overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-[0_24px_60px_rgba(15,23,42,0.12)]" style={{ height: CHART_HEIGHT }}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.14),transparent_38%),linear-gradient(180deg,rgba(255,255,255,0.5),rgba(248,250,252,0.95))]" />
        <div ref={chartContainerRef} className="absolute inset-0" />

        <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.14)] backdrop-blur">
          <button
            type="button"
            onClick={() => chartRef.current?.zoomIn()}
            className="flex h-11 min-w-27.5 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
            title="Zoom In"
          >
            Zoom In
          </button>
          <button
            type="button"
            onClick={() => chartRef.current?.fit({ animate: true })}
            className="flex h-11 min-w-27.5 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
            title="Fit to view"
          >
            Fit to View
          </button>
          <button
            type="button"
            onClick={() => chartRef.current?.zoomOut()}
            className="flex h-11 min-w-27.5 items-center justify-center rounded-xl bg-slate-100 px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-100 hover:text-emerald-800"
            title="Zoom Out"
          >
            Zoom Out
          </button>
        </div>
      </div>
    </div>
  );
}