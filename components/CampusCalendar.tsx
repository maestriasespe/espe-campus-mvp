"use client";

import { useMemo, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type EventItem = {
  date: string;
  title: string;
  type: "festivo" | "academico" | "evento";
  description?: string;
};

const events: EventItem[] = [
  {
    date: "2026-03-18",
    title: 'Conferencia Reforma Electoral "Plan B"',
    type: "evento",
    description: "Dr. Leonardo Valdés Zurita · 7:00 PM · Virtual vía Zoom",
  },
  {
    date: "2026-01-01",
    title: "Año Nuevo",
    type: "festivo",
  },
  {
    date: "2026-05-01",
    title: "Día del Trabajo",
    type: "festivo",
  },
  {
    date: "2026-09-16",
    title: "Independencia de México",
    type: "festivo",
  },
];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CampusCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const selectedKey = useMemo(() => toDateKey(selectedDate), [selectedDate]);
  const dayEvents = events.filter((event) => event.date === selectedKey);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileClassName={({ date, view }) => {
            if (view !== "month") return "";

            const key = toDateKey(date);
            const event = events.find((item) => item.date === key);

            if (!event) return "";
            if (event.type === "festivo") return "espe-holiday";
            if (event.type === "evento") return "espe-event";
            return "espe-academic";
          }}
        />
      </section>

      <aside className="rounded-xl2 border border-espe-line bg-espe-surface p-6 shadow-soft">
        <p className="text-xs font-semibold tracking-wide text-espe-muted">
          EVENTOS DEL DÍA
        </p>

        <h3 className="mt-2 text-xl font-extrabold text-espe-navy">
          {selectedDate.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div className="mt-5 space-y-4">
          {dayEvents.length > 0 ? (
            dayEvents.map((event, index) => (
              <div
                key={`${event.date}-${event.title}-${index}`}
                className="rounded-xl border border-espe-line bg-white/70 p-4"
              >
                <span className="inline-flex rounded-full bg-espe-gold/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-espe-gold">
                  {event.type}
                </span>

                <p className="mt-3 text-lg font-bold text-espe-navy">
                  {event.title}
                </p>

                {event.description ? (
                  <p className="mt-2 text-sm text-espe-muted">
                    {event.description}
                  </p>
                ) : null}
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-espe-line bg-white/70 p-4 text-sm text-espe-muted">
              No hay eventos registrados para este día.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
