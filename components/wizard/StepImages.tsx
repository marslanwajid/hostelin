"use client";

import React, { useRef, useState } from 'react';
import { IconBed, IconChevronDown, IconChevronUp, IconImage, IconUpload, IconX } from '../icons';
import { WizardData, Room, Building, HostelImage } from './types';

interface Props {
  data: WizardData;
  setData: React.Dispatch<React.SetStateAction<WizardData>>;
  red: string;
}

let _idCounter = 0;
const uid = (prefix = 'id') => `${prefix}_${Date.now()}_${++_idCounter}`;

const RoomImageSection = ({
  room,
  building,
  images,
  onAddFiles,
  onRemoveImage,
  red
}: {
  room: Room;
  building?: Building;
  images: HostelImage[];
  onAddFiles: (files: FileList | null) => void;
  onRemoveImage: (imgId: string) => void;
  red: string;
}) => {
  const [open, setOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="room-image-collapsible">
      <div className="room-image-collapsible-header" onClick={() => setOpen(!open)}>
        <div className="room-image-title">
          Room {room.roomNumber}
          <span className="room-image-subtitle">
            ({building?.name || 'Building'} · Floor {room.floor})
          </span>
          {images.length > 0 && (
            <span className="room-image-count">
              {images.length} photo{images.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="room-image-arrow">
          {open ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
        </div>
      </div>
      
      {open && (
        <div className="room-image-body">
          <div
            className="room-image-upload-zone"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onAddFiles(e.dataTransfer.files); }}
          >
            <IconUpload size={16} color="#ccc" />
            <span>Drop images or click to upload</span>
            <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
              onChange={(e) => onAddFiles(e.target.files)} />
          </div>
          
          {images.length > 0 && (
            <div className="room-image-grid">
              {images.map(img => (
                <div key={img.id} className="room-image-item">
                  <img src={img.preview} alt="" />
                  <button className="room-image-remove" onClick={() => onRemoveImage(img.id)}>
                    <IconX size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default function StepImages({ data, setData, red }: Props) {
  const [showRoomImages, setShowRoomImages] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const hostelFileRef = useRef<HTMLInputElement>(null);

  const handleHostelFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newImages = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map((f, i) => ({
        id: uid('img'),
        file: f,
        preview: URL.createObjectURL(f),
        isCover: data.hostelImages.length === 0 && i === 0,
      }));
    setData(d => ({ ...d, hostelImages: [...d.hostelImages, ...newImages] }));
  };

  const removeHostelImage = (imgId: string) => {
    setData(d => {
      const updated = d.hostelImages.filter(i => i.id !== imgId);
      if (updated.length > 0 && !updated.some(i => i.isCover)) {
        updated[0].isCover = true;
      }
      return { ...d, hostelImages: updated };
    });
  };

  const setCover = (imgId: string) => {
    setData(d => ({
      ...d,
      hostelImages: d.hostelImages.map(i => ({ ...i, isCover: i.id === imgId })),
    }));
  };

  const handleRoomFiles = (roomId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newImages = Array.from(files)
      .filter(f => f.type.startsWith('image/'))
      .map(f => ({
        id: uid('rimg'),
        file: f,
        preview: URL.createObjectURL(f),
      }));
    setData(d => ({
      ...d,
      roomImages: {
        ...d.roomImages,
        [roomId]: [...(d.roomImages[roomId] || []), ...newImages],
      },
    }));
  };

  const removeRoomImage = (roomId: string, imgId: string) => {
    setData(d => ({
      ...d,
      roomImages: {
        ...d.roomImages,
        [roomId]: (d.roomImages[roomId] || []).filter(i => i.id !== imgId),
      },
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Hostel Images */}
      <div className="wizard-card">
        <div className="wizard-card-header">
          <div className="wizard-card-icon" style={{ background: '#8b5cf615', color: '#8b5cf6' }}>
            <IconImage size={22} color="#8b5cf6" />
          </div>
          <div className="wizard-card-title">Hostel Images</div>
          <span style={{ marginLeft: 'auto', fontSize: 12, color: '#999', fontWeight: 500 }}>
            {data.hostelImages.length} images • Min 3 recommended
          </span>
        </div>

        <div
          className={`wizard-upload-zone large${dragOver ? ' dragover' : ''}`}
          onClick={() => hostelFileRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); handleHostelFiles(e.dataTransfer.files); }}
        >
          <div className="wizard-upload-zone-icon"><IconUpload size={32} /></div>
          <div className="wizard-upload-zone-text">Drag and drop images or click to browse</div>
          <div className="wizard-upload-zone-hint">JPG, PNG, WebP — First image becomes cover photo</div>
          <input ref= {hostelFileRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={(e) => handleHostelFiles(e.target.files)} />
        </div>

        {data.hostelImages.length > 0 && (
          <div className="hostel-image-grid">
            {data.hostelImages.map(img => (
              <div
                key={img.id}
                className="hostel-image-item"
                onClick={() => setCover(img.id)}
                title="Click to set as cover photo"
              >
                <img src={img.preview} alt="" />
                {img.isCover && <div className="hostel-image-cover-badge">★ Cover</div>}
                <button className="hostel-image-remove" onClick={(e) => { e.stopPropagation(); removeHostelImage(img.id); }}>
                  <IconX size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Room Images (optional) */}
      <div className="wizard-card">
        <div
          className="wizard-card-header clickable"
          onClick={() => setShowRoomImages(!showRoomImages)}
          style={{ marginBottom: showRoomImages ? 20 : 0, paddingBottom: showRoomImages ? 20 : 0, borderBottom: showRoomImages ? '1.5px solid #f0f0f0' : 'none' }}
        >
          <div className="wizard-card-icon" style={{ background: `${red}15`, color: red }}>
            <IconBed size={22} color={red} />
          </div>
          <div className="wizard-card-title">
            Room Images <span style={{ fontSize: 13, fontWeight: 500, color: '#999', marginLeft: 4 }}>(Optional)</span>
          </div>
          <div style={{ marginLeft: 'auto', color: '#999' }}>
            {showRoomImages ? <IconChevronUp size={20} /> : <IconChevronDown size={20} />}
          </div>
        </div>

        {showRoomImages && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {data.rooms.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#ccc', fontSize: 14, padding: 20 }}>No rooms added yet.</p>
            ) : (
              data.rooms.map(room => {
                const building = data.buildings.find(b => b.id === room.buildingId);
                const roomImages = data.roomImages[room.id] || [];
                return (
                  <RoomImageSection
                    key={room.id}
                    room={room}
                    building={building}
                    images={roomImages}
                    onAddFiles={(files) => handleRoomFiles(room.id, files)}
                    onRemoveImage={(imgId) => removeRoomImage(room.id, imgId)}
                    red={red}
                  />
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}


