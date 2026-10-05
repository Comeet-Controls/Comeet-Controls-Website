import { getProjects, initDB } from "@/lib/db";
import ProjectsClient from "./ProjectsClient";

export const revalidate = false;

export const metadata = {
  title: "Projects & Case Studies | Comeet Controls Pvt. Ltd.",
  description:
    "A showcase of custom Special Purpose Machines, automotive test benches, automated assembly cells, and inspection systems designed and deployed by Comeet Controls.",
};

const DEFAULT_PROJECTS = [
  {
    id: "transmission-rig",
    tag: "Test Equipment",
    icon: "fa-gear",
    category: "Testing Rigs",
    title: "Transmission Test Rig",
    short_desc: "Automated test rig identifying defects in transmission components before final assembly.",
    full_desc: "A fully automated end-of-line test rig built to evaluate automotive transmission assemblies.",
    industry: "Automotive OEM / Powertrain",
    hardware: "Siemens S7-1500 PLC, Kistler Torque Transducers, Servo Drive Actuation",
    challenge: "Detecting micro-backlash, gear transition resistance, and torque transmission anomalies on sub-assemblies.",
    solution: "Custom test rig with high-precision servo drive, automated pneumatic clamping, and continuous torque curve acquisition.",
    result: "Eliminated transmission tear-downs, saving over 40 hours of rework per week.",
    specs: [],
    badge: "Testing Rig",
  },
  {
    id: "rewinding-machine",
    tag: "Manufacturing",
    icon: "fa-rotate",
    category: "Manufacturing & SPMs",
    title: "Precision Multi-Material Rewinding Machine",
    short_desc: "Precision rewinding lines with advanced tension control for multiple materials.",
    full_desc: "A high-speed multi-material rewinding system with closed-loop tension control.",
    industry: "Converting, Foil & Irrigation Pipe Extrusion",
    hardware: "Mitsubishi iQ-R PLC, Closed-Loop Dancer Tension Arm, Dual Servo Spindles",
    challenge: "Handling thin aluminum foil without web tearing during high-speed rewinding.",
    solution: "Active closed-loop tension control system with ultra-sensitive load cells.",
    result: "Achieved 250 m/min with zero web breaks and ±0.5 mm edge alignment.",
    specs: [],
    badge: "Rewinding Machine",
  },
  {
    id: "assembly-line",
    tag: "Assembly",
    icon: "fa-industry",
    category: "Assembly Lines",
    title: "Complete End-of-Line Assembly Line",
    short_desc: "Full EOL assembly line with integrated data acquisition for traceability.",
    full_desc: "A turnkey end-of-line automated assembly station with multi-station PLC interlocking.",
    industry: "Industrial Valves & Fluid Controls",
    hardware: "Allen Bradley CompactLogix, Cognex Vision Cameras, Barcode Handlers, SQL Server",
    challenge: "Multi-part valve assembly with O-ring verification and full serial number traceability.",
    solution: "8-station semi-automatic rotary and linear transfer line with vision inspection.",
    result: "140% throughput increase with complete digital traceability.",
    specs: [],
    badge: "Assembly Line",
  },
  {
    id: "paper-sheeter",
    tag: "Paper Industry",
    icon: "fa-file",
    category: "Manufacturing & SPMs",
    title: "High-Speed Automated Paper Sheeter Line",
    short_desc: "Automated sheeter producing precise sheets from roll stock.",
    full_desc: "A fully automated sheeting line that converts large paper rolls into precision-cut sheets.",
    industry: "Paper & Packaging Converting",
    hardware: "Schneider Electric PacDrive, Synchronized Rotary Cutter, Safety Light Curtains",
    challenge: "Converting raw paper rolls into precise sheets at high cycle rates with operator safety.",
    solution: "Servo-synchronized rotary shear cutter with pneumatic deceleration nip rollers.",
    result: "±0.25 mm cutting accuracy at 180 cuts/min with category-4 functional safety.",
    specs: [],
    badge: "Paper Converting",
  },
  {
    id: "oil-pump-rig",
    tag: "Hydraulics",
    icon: "fa-oil-can",
    category: "Testing Rigs",
    title: "Hydraulic Oil Pump Performance Test Rig",
    short_desc: "Performance evaluation test rig for oil pumps ensuring reliability.",
    full_desc: "A hydraulic pump performance test rig that evaluates volumetric efficiency and pressure relief behavior.",
    industry: "Hydraulics & Heavy Equipment",
    hardware: "Siemens S7-1200 PLC, High-Pressure Flow Meters, Proportional Pressure Valves",
    challenge: "Validating flow rate vs pressure characteristics across full operating temperature ranges.",
    solution: "Fully enclosed hydraulic test cell with automated oil temperature conditioning.",
    result: "Reduced 12-minute test cycle to 3 minutes with signed PDF inspection certificates.",
    specs: [],
    badge: "Hydraulics Rig",
  },
  {
    id: "nvh-system",
    tag: "Quality Control",
    icon: "fa-wave-square",
    category: "Quality & Inspection",
    title: "NVH Acoustic & Vibration System Integration",
    short_desc: "Noise, Vibration & Harshness detection systems using reference-based analysis.",
    full_desc: "A production-integrated NVH system that captures high-resolution vibration signatures.",
    industry: "Precision Rotating Machinery & Motors",
    hardware: "National Instruments DAQ, Triaxial Piezoelectric Accelerometers, Custom FFT Analysis",
    challenge: "Identifying invisible bearing defects that cannot be detected by human hearing.",
    solution: "Industrial accelerometers connected to a DSP engine comparing frequency spectrums against golden master profiles.",
    result: "99.4% defect detection accuracy for microscopic bearing spalls.",
    specs: [],
    badge: "Inspection System",
  },
];

export default async function ProjectsPage() {
  let projects = DEFAULT_PROJECTS;
  try {
    await initDB();
    const rows = await getProjects();
    if (rows && rows.length > 0) {
      // Enrich DB rows with display fields used by the UI
      projects = rows.map((r) => ({
        ...r,
        category: r.tag || "Other",
        badge: r.tag || "Project",
        industry: r.industry || "",
        hardware: r.hardware || "",
        challenge: r.challenge || r.short_desc || "",
        solution: r.solution || r.full_desc || "",
        result: r.result || "",
      }));
    }
  } catch {
    // DB not available — use defaults
  }

  return <ProjectsClient projects={projects} />;
}