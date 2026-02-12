import { supabase } from "@/lib/supabase";
import { Tag } from "../models/tag.model";

export const TagService = {
  /**
   * Récupère un tag existant dans Supabase par son ID
   */
  async getTagById(id: string): Promise<Tag | null> {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      reference: data.reference,
      // On s'assure que metadata est un objet, même si la colonne est vide
      metadata: data.metadata || {}, 
      isAssigned: data.is_assigned,
      createdAt: new Date(data.created_at),
    };
  },

  /**
   * Récupère TOUS les tags pour la Dashboard
   */
  async getAllTags(): Promise<Tag[]> {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    return data.map(item => ({
      id: item.id,
      reference: item.reference,
      metadata: item.metadata || {},
      isAssigned: item.is_assigned,
      createdAt: new Date(item.created_at)
    }));
  },

  /**
   * Enregistre ou met à jour un tag (Injection avec metadata)
   */
  async saveTag(tag: Tag): Promise<{ success: boolean; error?: any }> {
    const { error } = await supabase
      .from("tags")
      .upsert({
        id: tag.id,
        reference: tag.reference,
        is_assigned: tag.isAssigned,
        metadata: tag.metadata, // On envoie l'objet des champs dynamiques
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error("Erreur Supabase lors de la sauvegarde:", error.message);
    }

    return { success: !error, error };
  },

  /**
   * Supprime un tag (pour la fonctionnalité Recyclage/Suppression)
   */
  async deleteTag(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("tags")
      .delete()
      .eq('id', id);
    
    return !error;
  },

  /**
   * Réinitialise un tag (Soft Delete) : remet is_assigned à false et vide les métadonnées.
   */
  async resetTag(id: string): Promise<boolean> {
    const { error } = await supabase
      .from("tags")
      .update({
        is_assigned: false,
        metadata: {},
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    return !error;
  }
};