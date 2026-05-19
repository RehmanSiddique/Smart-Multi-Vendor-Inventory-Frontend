import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '../components/Layout';
import { promotionAPI } from '../services/extendedApi';
import { handleApiError } from '../services/api';

const Promotions = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data: promoRes, isLoading } = useQuery({
    queryKey: ['promotions'],
    queryFn: () => promotionAPI.getAll(),
  });

  const promotions = promoRes?.data?.results || promoRes?.data || [];

  const deleteMutation = useMutation({
    mutationFn: (id) => promotionAPI.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['promotions']),
    onError: (err) => alert(`Delete Failed: ${handleApiError(err).message}`)
  });

  return (
    <Layout>
      <div className="section-header">
        <div>
          <h1 className="page-title">Commercial Promotions</h1>
          <p className="page-subtitle">Configure discount rules and seasonal campaign assets</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Campaign</button>
      </div>

      <div className="grid grid-3 mt-lg">
        {isLoading ? (
          <div className="block"><div className="spinner"></div></div>
        ) : promotions.map(p => (
          <div key={p.id} className="block border-accent">
            <div className="flex justify-between items-start mb-md">
               <div>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <div className="font-mono text-sm text-primary">{p.code}</div>
               </div>
               <span className={`status-badge ${p.is_active ? 'status-success' : 'status-danger'}`}>
                  {p.is_active ? 'ACTIVE' : 'EXPIRED'}
               </span>
            </div>
            
            <div className="mt-md mb-lg">
               <div className="text-2xl font-black text-accent">
                  {p.discount_type === 'percentage' ? `${p.discount_value}%` : `$${p.discount_value}`} <span className="text-xs font-normal text-muted">REDUCTION</span>
               </div>
            </div>

            <div className="text-xs text-muted mb-lg">
               VALIDITY: {new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}
            </div>

            <div className="flex justify-end gap-md pt-md border-t border-gray-100">
               <button className="btn-icon text-danger" onClick={() => { if(window.confirm('Terminate campaign?')) deleteMutation.mutate(p.id); }}>🗑️ End Now</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Promotions;
