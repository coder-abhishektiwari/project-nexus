import React from "react";

const App = () => (
    <div>
        {/* Paper Padding (Forcing Times New Roman) */}
        <div
            className="p-[60px] text-[#000] leading-[1.6]"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
        >

            {/* Header */}
            <div className="border-[1.5px] text-center border-black p-3 mb-10 border-dashed">
                <h1 className="text-[15pt] font-bold uppercase m-0">📘 Documentation Rules</h1>
            </div>

            {/* Purpose of this Document */}
            <section className="mb-8">
                <h3 className="text-[14pt] font-bold uppercase mb-4 mb-4 border-b border-black">Purpose of this Document</h3>
                <p className="text-[12pt]">This documentation is designed to provide a structured framework for project reporting. It aims to:</p>
                <ul className="list-disc ml-10 mt-2 space-y-1 text-[12pt]">
                    <li>Explain the project architecture and logic clearly to any reader.</li>
                    <li>Follow professional software industry documentation standards.</li>
                    <li>Ensure the content remains reusable and easy to customize.</li>
                </ul>
                <p className="mt-4 font-bold underline italic text-[12pt]">
                    Important: This document is independent of any specific academic institution.
                </p>
            </section>

            {/* General Rules */}
            <section className="mb-8 border-t border-gray-400 pt-6 ">
                <h3 className="text-[14pt] font-bold uppercase mb-4 mb-4 border-b border-black">General Rules (Mandatory)</h3>
                <ul className="list-disc ml-10 space-y-2 text-[12pt]">
                    <li>All content must be written in formal, professional English.</li>
                    <li>The document must define the scope, methodology, and implementation.</li>
                    <li>Technical diagrams must be clear and properly labeled.</li>
                    <li>Maintain a consistent structure across all chapters.</li>
                </ul>
            </section>

            {/* Project Structure */}
            <section className="mb-8 border-t border-b border-gray-400 pt-6">
                <h3 className="text-[14pt] font-bold uppercase mb-4 border-b border-black inline-block">Project Structure</h3>
                <p className="font-bold text-[12pt] my-4 underline italic">Table of Contents Overview:</p>
                <div className="grid grid-cols-1 gap-y-1 text-[12pt] mb-8 ml-4">
                    <p>1. Introduction</p>
                    <p>2. Project Overview</p>
                    <p>3. Timeline & Workflow</p>
                    <p>4. System Requirements</p>
                    <p>5. System Design</p>
                    <p>6. Implementation Details</p>
                    <p>7. Testing & Validation</p>
                    <p>8. Results & Screenshots</p>
                    <p>9. Conclusion</p>
                    <p>10. References</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">1. Introduction</h3>
                        <div className="ml-4">
                            <p><strong>Background:</strong> Real-world context or motivation.</p>
                            <p><strong>Problem Definition:</strong> Clear description of the problem.</p>
                            <p><strong>Objectives:</strong> Efficiency, scalability, automation.</p>
                            <p><strong>Intended Users:</strong> Target audience of the system.</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">2. Project Overview</h3>
                        <div className="ml-4">
                            <p><strong>System Description:</strong> High-level overview of the application.</p>
                            <p><strong>Key Features:</strong> List of major functionalities.</p>
                            <p><strong>User Flow:</strong> How users interact with the system.</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">3. Project Timeline</h3>
                        <table className="ml-4 w-full border-collapse border border-black text-[9pt]">
                            <thead>
                                <tr className="bg-gray-100 text-black">
                                    <th className="border border-black p-2 text-left">Phase</th>
                                    <th className="border border-black p-2 text-left">Activity Description</th>
                                    <th className="border border-black p-2 text-left">Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="border border-black p-2 text-center">Phase 1</td><td className="border border-black p-2">Requirement Gathering & Analysis</td><td className="border border-black p-2">5–7 Days</td></tr>
                                <tr><td className="border border-black p-2 text-center">Phase 2</td><td className="border border-black p-2">System Design (UI & Database)</td><td className="border border-black p-2">5 Days</td></tr>
                                <tr><td className="border border-black p-2 text-center">Phase 3</td><td className="border border-black p-2">Core Development & Integration</td><td className="border border-black p-2">2–4 Weeks</td></tr>
                                <tr><td className="border border-black p-2 text-center">Phase 4</td><td className="border border-black p-2">Final Testing & Bug Fixing</td><td className="border border-black p-2">1 Week</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">4. System Requirements</h3>
                        <div className="ml-4">
                            <p className="mt-2"><strong>Hardware:</strong> Minimum i3 Processor, 8GB RAM, and SSD storage.</p>
                            <p><strong>Software:</strong> VS Code, Node.js/Python/Java, MongoDB/MySQL, etc.</p>

                        </div>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">5. System Design</h3>
                        <p className="mt-2 ml-4 italic">Include Architecture Diagrams, ER Diagrams, and Data Flow Diagrams (DFD) here.</p>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">6. Implementation Details</h3>
                        <p className="mt-2 ml-4">Explain the core modules, choice of framework, and logic flow of the application.</p>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">7. Testing & Validation</h3>
                        <p className="mt-2 ml-4 italic">Unit Testing, Integration Testing, and System Testing results must be documented.</p>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">8. Results & Screenshots</h3>
                        <p className="mt-2 ml-4">Insert actual screenshots of the running application with brief captions.</p>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">9. Conclusion & Future Scope</h3>
                        <p className="mt-2 ml-4">Summary of findings and potential future enhancements for the project.</p>
                    </div>

                    <div>
                        <h3 className="text-[13pt] font-bold uppercase">10. References</h3>
                        <p className="mt-2 ml-4 ">Official documentation, APIs, tools, articles.</p>
                    </div>
                </div>
            </section>

            {/* Formatting Guide */}
            <section className="mt-12 p-4 border border-dashed border-gray-400">
                <h3 className="text-[12pt] font-bold uppercase mb-2">📐 Formatting (Recommended)</h3>
                <ul className="list-disc ml-8 text-[11pt] space-y-1">
                    <li>Font: Times New Roman | Content Size: 12 | Heading: 14–16</li>
                    <li>Line Spacing: 1.5 | Page Size: A4 | Alignment: Justified</li>
                    <li>Page Margins: 1" (2.54 cm) on all sides</li>
                </ul>
            </section>

            {/* Page Count Info */}
            <section className="mt-6 p-4 bg-gray-50 border border-gray-200">
                <h3 className="text-[12pt] font-bold uppercase mb-2">📄 Recommended Page Count</h3>
                <ul className="list-none text-[11pt] space-y-1">
                    <li>• Small Project: 15–25 pages</li>
                    <li>• Medium Project: 25–40 pages</li>
                    <li>• Large / Industry-Scale Project: 40–60 pages</li>
                </ul>
            </section>

            {/* Document Footer */}
            <div className="mt-20 text-[10pt] text-gray-500 text-right italic">
                Project Documentation Rules | Project Nexus
            </div>

        </div>
    </div>
);

export default App;
