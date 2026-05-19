import React, { useState } from 'react';
import Layout from '../components/Layout';
import { bulkAPI, downloadBlob } from '../services/extendedApi';
import './Products.css'; // Reusing base matrix layout

const BulkOperations = () => {
    const [importing, setImporting] = useState(false);
    const [result, setResult] = useState(null);

    const handleProductImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImporting(true);
        setResult(null);
        try {
            const response = await bulkAPI.importProducts(file);
            setResult(response.data);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Product Import Failed. Check CSV structure.');
        } finally {
            setImporting(false);
            e.target.value = '';
        }
    };

    const handleProductExport = async () => {
        try {
            const response = await bulkAPI.exportProducts();
            downloadBlob(response.data, 'products_enterprise_export.csv');
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed.');
        }
    };

    const handleCustomerImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImporting(true);
        try {
            const response = await bulkAPI.importCustomers(file);
            alert(`Successfully imported ${response.data.success} customers.`);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Customer Import Failed.');
        } finally {
            setImporting(false);
            e.target.value = '';
        }
    };

    return (
        <Layout>
            <div className="products-page">
                <div className="page-hud">
                    <div className="asset-title-block">
                        <h1>Bulk <span className="text-primary">Operations</span></h1>
                        <p>Import & Export • Mass Data Management</p>
                    </div>
                </div>

                <div className="grid grid-2 gap-8 mt-10">
                    <div className="glass-card p-10 hover-lift animate-entrance">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-3xl flex items-center justify-center shadow-inner">📦</div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Product Data</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Bulk Product Import/Export</p>
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">
                            Update your entire product catalog or export current data using CSV files.
                        </p>
                        
                        <div className="flex gap-4">
                            <button className="btn-add-asset bg-primary px-8" onClick={handleProductExport}>
                                ⬇️ Export Products
                            </button>
                            <label className="page-btn bg-white px-8 flex items-center justify-center cursor-pointer hover:bg-slate-50 border-2 border-slate-50">
                                ⬆️ Import CSV
                                <input type="file" accept=".csv" onChange={handleProductImport} hidden disabled={importing} />
                            </label>
                        </div>

                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[9px] text-slate-400 tracking-widest leading-loose">
                            <strong className="text-slate-600">CSV FORMAT REQUIRED:</strong><br/>
                            NAME, SKU, CATEGORY, PRICE, COST, QUANTITY, REORDER_LEVEL
                        </div>
                    </div>

                    <div className="glass-card p-10 hover-lift animate-entrance" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-3xl flex items-center justify-center shadow-inner">👥</div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Import</h2>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Bulk Customer Upload</p>
                            </div>
                        </div>
                        <p className="text-slate-500 font-medium text-sm mb-10 leading-relaxed">
                            Import your existing customer database into the system via CSV.
                        </p>
                        
                        <div className="flex gap-4">
                            <label className="btn-add-asset bg-emerald-500 hover:bg-emerald-600 px-8 flex items-center justify-center cursor-pointer shadow-lg shadow-emerald-500/20">
                                ⬆️ Import Customers
                                <input type="file" accept=".csv" onChange={handleCustomerImport} hidden disabled={importing} />
                            </label>
                        </div>

                        <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 font-mono text-[9px] text-slate-400 tracking-widest leading-loose">
                            <strong className="text-slate-600">CSV FORMAT REQUIRED:</strong><br/>
                            NAME, EMAIL, PHONE, TYPE, CITY, STATE, COUNTRY
                        </div>
                    </div>
                </div>

                {importing && (
                    <div className="form-overlay fixed inset-0 flex flex-col items-center justify-center z-[1100] animate-entrance">
                        <div className="spinner-large"></div>
                        <h3 className="mt-8 text-2xl font-black text-slate-900 tracking-tight">Processing Import...</h3>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Please do not close this window.</p>
                    </div>
                )}

                {result && (
                    <div className={`glass-card mt-10 p-10 animate-entrance border-2 ${result.errors?.length > 0 ? 'border-rose-100' : 'border-emerald-100'}`}>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Import Summary</h3>
                        <div className="grid grid-3 gap-8">
                            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                                <div className="text-4xl font-black text-emerald-600">{result.success}</div>
                                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-2">Successful Imports</div>
                            </div>
                            <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                                <div className="text-4xl font-black text-rose-600">{result.errors?.length || 0}</div>
                                <div className="text-[9px] font-black text-rose-400 uppercase tracking-widest mt-2">Failed Rows</div>
                            </div>
                        </div>
                        {result.errors?.length > 0 && (
                            <div className="mt-10">
                                <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[0.2em] mb-4">Error Log:</h4>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 overflow-y-auto max-h-60">
                                    <ul className="space-y-3">
                                        {result.errors.map((e, idx) => (
                                            <li key={idx} className="flex gap-3 text-xs font-bold text-slate-600">
                                                <span className="text-rose-400">⚠️</span>
                                                <span>ROW {idx + 1}: {e}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BulkOperations;
