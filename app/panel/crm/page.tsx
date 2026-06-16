"use client";

import React, { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { IconChat, IconMapPin, IconEdit, IconTrash, IconSparkle } from '@/components/icons';

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'new' | 'contact' | 'meeting' | 'offer' | 'closed';

interface Lead {
  id: string;
  name: string;
  phone: string;
  listingTitle: string;
  city: string;
  budget: string;
  stage: Stage;
  lastAction: string;
  daysAgo: number;
  hot?: boolean;
}

// ─── Sample Data ──────────────────────────────────────────────────────────────

const INITIAL_LEADS: Lead[] = [
  { id: "l1", name: "Ahmet Yildiz",    phone: "0532 111 22 33", listingTitle: "Moda’da deniz manzarali 3+1",        city: "Kadiköy",  budget: "8,5M TL",   stage: "new",     lastAction: "WhatsApp talebi",        daysAgo: 0, hot: true },
  { id: "l2", name: "Fatma Sahin",     phone: "0543 222 33 44", listingTitle: "Atasehir yeni proje 3+1",            city: "Atasehir", budget: "6,2M TL",   stage: "new",     lastAction: "Telefon talebi",         daysAgo: 1 },
  { id: "l3", name: "Kemal Demir",     phone: "0555 333 44 55", listingTitle: "Cihangir’de yenilenmis 2+1",         city: "Beyoglu",  budget: "38K TL/ay", stage: "contact", lastAction: "Arandi, merak ediyor",   daysAgo: 1 },
  { id: "l4", name: "Selin Arslan",    phone: "0507 444 55 66", listingTitle: "Cesme’de havuzlu mustakil villa",    city: "Cesme",    budget: "18,5M TL",  stage: "contact", lastAction: "E-posta gonderildi",     daysAgo: 2 },
  { id: "l5", name: "Murat Koc",       phone: "0533 555 66 77", listingTitle: "Levent ofis kati",                   city: "Besiktas", budget: "145K TL/ay", stage: "meeting", lastAction: "Yer gosterme ayarlandi", daysAgo: 0, hot: true },
  { id: "l6", name: "Zehra Celik",     phone: "0544 666 77 88", listingTitle: "Kadikoy yeni bina 2+1",              city: "Kadiköy",  budget: "4,2M TL",   stage: "meeting", lastAction: "2. gorusme yapildi",     daysAgo: 3 },
  { id: "l7", name: "Bora Unsal",      phone: "0511 777 88 99", listingTitle: "Bebek’te bogaz manzarali 3+1",       city: "Besiktas", budget: "92K TL/ay", stage: "offer",   lastAction: "Teklif: 88K TL",         daysAgo: 1, hot: true },
  { id: "l8", name: "Neslihan Ozturk", phone: "0522 888 99 00", listingTitle: "Beyoglu cumba tarihi apartman",      city: "Beyoglu",  budget: "5,8M TL",   stage: "offer",   lastAction: "Karsı teklif bekleniyor",daysAgo: 2 },
  { id: "l9", name: "Caner Bulut",     phone: "0566 999 00 11", listingTitle: "Bodrum Yalikavak deniz manzarali ev",city: "Bodrum",   budget: "58K TL/ay", stage: "closed",  lastAction: "Sozlesme imzalandi",     daysAgo: 5 },
];

const STAGES: { id: Stage; label: string; color: string }[] = [
  { id: 'new',     label: 'Yeni Lead',  color: 'var(--teal)' },
  { id: 'contact', label: 'İletişimde', color: '#7c6fcd' },
  { id: 'meeting', label: 'Görüşme',    color: 'var(--gold)' },
  { id: 'offer',   label: 'Teklif',     color: '#e07b39' },
  { id: 'closed',  label: 'Kapandı',    color: '#3db56a' },
];

// ─── Lead Card ────────────────────────────────────────────────────────────────

const LeadCard = ({ lead, isDragging }: { lead: Lead; isDragging?: boolean }) => {
  const {
    attributes, listeners, setNodeRef, transform, transition,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="crm-card"
    >
      {lead.hot && (
        <div className="crm-card-hot">
          <IconSparkle size={10}/> Sıcak
        </div>
      )}
      <div className="crm-card-name">{lead.name}</div>
      <div className="crm-card-listing">
        <IconMapPin/> {lead.listingTitle}
      </div>
      <div className="crm-card-meta">
        <span className="crm-card-budget">{lead.budget}</span>
        <span className="crm-card-city">{lead.city}</span>
      </div>
      <div className="crm-card-last">
        <span>{lead.lastAction}</span>
        <span className="crm-card-days">{lead.daysAgo === 0 ? 'Bugün' : `${lead.daysAgo}g önce`}</span>
      </div>
      <div className="crm-card-actions">
        <a href={`tel:${lead.phone}`} className="crm-card-btn" title="Ara">
          <IconChat size={13}/> Ara
        </a>
        <button className="crm-card-btn" title="Düzenle">
          <IconEdit size={13}/> Düzenle
        </button>
        <button className="crm-card-btn crm-card-btn-danger" title="Sil">
          <IconTrash size={13}/>
        </button>
      </div>
    </div>
  );
};

// ─── Column ───────────────────────────────────────────────────────────────────

const KanbanColumn = ({ stage, leads, activeId }: { stage: typeof STAGES[0]; leads: Lead[]; activeId: string | null }) => {
  return (
    <div className="crm-col">
      <div className="crm-col-head" style={{ borderTopColor: stage.color }}>
        <span className="crm-col-label">{stage.label}</span>
        <span className="crm-col-count" style={{ background: stage.color }}>{leads.length}</span>
      </div>
      <SortableContext items={leads.map(l => l.id)} strategy={verticalListSortingStrategy}>
        <div className="crm-col-body">
          {leads.map(lead => (
            <LeadCard key={lead.id} lead={lead} isDragging={activeId === lead.id} />
          ))}
          {leads.length === 0 && (
            <div className="crm-col-empty">Lead yok</div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const activeLead = leads.find(l => l.id === activeId) ?? null;

  const handleDragStart = (e: DragStartEvent) => {
    setActiveId(e.active.id as string);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;

    const activeStage = leads.find(l => l.id === active.id)?.stage;
    // Check if over a column header (stage id)
    const overStage = STAGES.find(s => s.id === over.id)?.id
      ?? leads.find(l => l.id === over.id)?.stage;

    if (!activeStage || !overStage || activeStage === overStage) return;

    setLeads(prev =>
      prev.map(l => l.id === active.id ? { ...l, stage: overStage } : l)
    );
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;

    const overStage = STAGES.find(s => s.id === over.id)?.id
      ?? leads.find(l => l.id === over.id)?.stage;

    if (overStage) {
      setLeads(prev =>
        prev.map(l => l.id === active.id ? { ...l, stage: overStage } : l)
      );
    }
  };

  const totalHot = leads.filter(l => l.hot).length;
  const totalClosed = leads.filter(l => l.stage === 'closed').length;

  return (
    <div className="partner">
      <div className="partner-inner">
        {/* Header */}
        <div className="partner-head">
          <div>
            <span className="eyebrow partner-eyebrow">CRM · Lead Yönetimi</span>
            <h1>Pipeline <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Kanban.</em></h1>
            <p style={{ margin: '10px 0 0', color: 'rgba(255,253,248,0.6)', fontSize: 15 }}>
              {leads.length} aktif lead · {totalHot} sıcak · {totalClosed} kapandı bu ay
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-atlas btn-sm">
              <IconSparkle size={13}/> Atlas AI ile Önceliklendir
            </button>
            <button className="btn btn-primary">+ Yeni Lead</button>
          </div>
        </div>

        {/* Stats strip */}
        <div className="partner-metrics" style={{ marginBottom: 24 }}>
          {STAGES.map(s => {
            const count = leads.filter(l => l.stage === s.id).length;
            return (
              <div key={s.id} className="pmcard">
                <div className="pmcard-label">{s.label}</div>
                <div className="pmcard-value" style={{ color: s.color }}>{count}</div>
                <div className="pmcard-trend">{count} lead</div>
              </div>
            );
          })}
        </div>

        {/* Kanban board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="crm-board">
            {STAGES.map(stage => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                leads={leads.filter(l => l.stage === stage.id)}
                activeId={activeId}
              />
            ))}
          </div>

          <DragOverlay>
            {activeLead && (
              <div className="crm-card crm-card-overlay">
                <div className="crm-card-name">{activeLead.name}</div>
                <div className="crm-card-listing"><IconMapPin/> {activeLead.listingTitle}</div>
                <div className="crm-card-meta">
                  <span className="crm-card-budget">{activeLead.budget}</span>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
