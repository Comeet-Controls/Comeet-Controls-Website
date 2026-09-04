const items = [
  { icon: "fa-microchip",       label: "PLC Programming"       },
  { icon: "fa-display",         label: "SCADA Development"     },
  { icon: "fa-gears",           label: "Special Purpose Machines" },
  { icon: "fa-bolt",            label: "Electrical Control Panels" },
  { icon: "fa-robot",           label: "HMI Development"       },
  { icon: "fa-diagram-project", label: "Automation Consulting" },
  { icon: "fa-layer-group",     label: "Power Distribution"    },
  { icon: "fa-sliders",         label: "VFD & Servo Systems"   },
];
const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div className="bg-surface border-t border-b border-accent/15 py-4 overflow-hidden">
      <div className="flex w-max marquee-track">
        {doubled.map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-10 text-sm font-medium text-muted whitespace-nowrap">
            <i className={`fas ${item.icon} text-accent`} />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
