export default function DataRequestEditor({ store }) {
  const value = store.data.meta?.dataRequest || { enabled: false, purpose: '', fields: [], requiredFor: [] };
  const set = patch => store.setMeta({ dataRequest: { ...value, ...patch } });
  const toggle = (key, item) => set({ [key]: (value[key] || []).includes(item) ? value[key].filter(v => v !== item) : [...(value[key] || []), item] });
  return <div style={{ padding: 12, border: '1px solid #ddd', borderRadius: 10, marginBottom: 12 }}>
    <label><input type="checkbox" checked={value.enabled} onChange={e => set({ enabled: e.target.checked })} /> Request data</label>
    {value.enabled && <>
      <label style={{ display: 'block', marginTop: 10 }}>Purpose<textarea aria-label="Data request purpose" maxLength={500} value={value.purpose} onChange={e => set({ purpose: e.target.value })} style={{ width: '100%', boxSizing: 'border-box' }} /></label>
      {Object.entries({ name: 'Name', email: 'Email', phone: 'Phone', avatar: 'Profile photo' }).map(([field, label]) => <label key={field} style={{ display: 'block', marginTop: 6 }}><input type="checkbox" checked={(value.fields || []).includes(field)} onChange={() => toggle('fields', field)} /> {label}</label>)}
      <div style={{ marginTop: 12 }}>Required for</div>
      {Object.entries({ checkout: 'Checkout', submit_form: 'Form submission' }).map(([action, label]) => <label key={action} style={{ display: 'block', marginTop: 6 }}><input type="checkbox" checked={(value.requiredFor || []).includes(action)} onChange={() => toggle('requiredFor', action)} /> {label}</label>)}
    </>}
  </div>;
}
