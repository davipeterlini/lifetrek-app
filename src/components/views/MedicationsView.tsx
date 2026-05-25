import React, { useState } from "react";
import { Pill, Plus, Clock, CheckCircle } from "lucide-react";

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  taken: boolean;
}

export const MedicationsView: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>([
    { id: "1", name: "Vitamin D", dosage: "1000 IU", frequency: "Daily", taken: false },
    { id: "2", name: "Omega-3", dosage: "500mg", frequency: "Daily", taken: false },
    { id: "3", name: "Magnesium", dosage: "400mg", frequency: "Before bed", taken: false },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDosage, setNewDosage] = useState("");
  const [newFrequency, setNewFrequency] = useState("");

  const toggleMedication = (id: string) => {
    setMedications((prev) =>
      prev.map((med) =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  const addMedication = (e: React.FormEvent) => {
    e.preventDefault();
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        name: newName,
        dosage: newDosage,
        frequency: newFrequency,
        taken: false,
      },
    ]);
    setNewName("");
    setNewDosage("");
    setNewFrequency("");
    setShowForm(false);
  };

  const takenCount = medications.filter((m) => m.taken).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Medications & Supplements
          </h1>
          <p className="text-gray-400 text-sm mt-1">Track your daily medications and supplements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:scale-[1.02] transition-transform"
        >
          <Plus size={18} />
          Add Medication
        </button>
      </div>

      {/* Today's Progress */}
      <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/20 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Clock size={24} className="text-cyan-400" />
            <span className="text-white font-semibold">Today's Progress</span>
          </div>
          <span className="text-2xl font-bold text-cyan-400">
            {takenCount}/{medications.length}
          </span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(takenCount / medications.length) * 100}%` }}
          />
        </div>
      </div>

      {showForm && (
        <form onSubmit={addMedication} className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6 space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Medication Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none"
              placeholder="Vitamin D"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Dosage</label>
              <input
                type="text"
                value={newDosage}
                onChange={(e) => setNewDosage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="1000 IU"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Frequency</label>
              <input
                type="text"
                value={newFrequency}
                onChange={(e) => setNewFrequency(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-cyan-500 focus:outline-none"
                placeholder="Daily"
                required
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:scale-[1.02] transition-transform"
            >
              Add Medication
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 rounded-lg bg-gray-700 text-white font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Medications List */}
      <div className="bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.05] p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Your Medications</h3>
        <div className="space-y-3">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                med.taken
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-white/[0.03] border-white/[0.05]"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleMedication(med.id)}
                  className={`p-2 rounded-full transition-colors ${
                    med.taken
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-gray-700 text-gray-400 hover:bg-gray-600"
                  }`}
                >
                  {med.taken ? <CheckCircle size={20} /> : <Pill size={20} />}
                </button>
                <div>
                  <p className={`text-white font-medium ${med.taken ? "line-through opacity-60" : ""}`}>
                    {med.name}
                  </p>
                  <p className="text-gray-500 text-sm">{med.dosage} - {med.frequency}</p>
                </div>
              </div>
              {med.taken && (
                <span className="text-emerald-400 text-sm font-medium">Taken</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};