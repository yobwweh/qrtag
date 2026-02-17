"use client";

import { useState, useEffect } from "react";
import { Tag, createEmptyTag } from "../models/tag.model";
import { TagService } from "../services/tag.service";
import { TAG_TEMPLATES } from "../models/tag.templates";

export const useTagController = (tagId: string) => {
  const [tag, setTag] = useState<Tag>(createEmptyTag(tagId));
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadTag() {
      const data = await TagService.getTagById(tagId);
      if (data) setTag(data);
      setLoading(false);
    }
    loadTag();
  }, [tagId]);

  const updateLocalMetadata = (key: string, value: string) => {
    setTag(prev => ({
      ...prev,
      metadata: { ...prev.metadata, [key]: value }
    }));
  };

  const removeLocalField = (key: string) => {
    setTag(prev => {
      const newMetadata = { ...prev.metadata };
      delete newMetadata[key];
      return { ...prev, metadata: newMetadata };
    });
  };

  const setCategory = (category: string) => {
    const template = TAG_TEMPLATES[category];
    if (template) {
      setTag(prev => ({
        ...prev,
        category: category,
        metadata: { ...template.defaultMetadata } // Reset avec les champs par défaut
      }));
    } else {
      setTag(prev => ({ ...prev, category }));
    }
  };

  const handleSave = async (reference: string) => {
    setIsSubmitting(true);
    const updatedTag = { ...tag, reference, isAssigned: true };
    const result = await TagService.saveTag(updatedTag);
    if (result.success) {
      setTag(updatedTag); // Mise à jour locale pour un retour immédiat
    } else {
      alert("Erreur : " + result.error.message);
    }
    setIsSubmitting(false);
  };

  const handleReset = async () => {
    if (!confirm("Êtes-vous sûr de vouloir libérer ce tag ? Toutes les données seront effacées.")) return;

    setIsSubmitting(true);
    const success = await TagService.resetTag(tagId);
    if (success) {
      setTag(createEmptyTag(tagId)); // Remet l'état local à zéro
    } else {
      alert("Erreur lors de la réinitialisation du tag.");
    }
    setIsSubmitting(false);
  };

  return { tag, loading, isSubmitting, handleSave, updateLocalMetadata, removeLocalField, handleReset, setCategory };
};