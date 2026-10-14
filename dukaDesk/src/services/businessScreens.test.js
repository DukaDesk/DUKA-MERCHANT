import { expect, it } from 'vitest';
import { convertManifestToDesign, convertBackendTemplateToDesign } from './staticTemplates';
it('removes platform profile pages and tabs from local business templates', () => {
 const design = convertManifestToDesign({navigation:{ initialScreen:'profile', tabs:[{screenId:'home'},{screenId:'profile'}]}}, {home:{title:'Home'},profile:{title:'Profile'}});
 expect(Object.keys(design.screens)).toEqual(['home']);
 expect(design.navigation.initialScreen).toBe('home');
 expect(design.navigation.tabs.map(t=>t.screenId)).toEqual(['home']);
});
it('removes platform profile pages and tabs from backend business templates', () => {
 const design=convertBackendTemplateToDesign({config:{pages:[{slug:'home',name:'Home'},{slug:'profile',name:'Profile',isHome:true}],navigation:[{target:'/home'},{target:'/profile'}]}});
 expect(Object.keys(design.screens)).toEqual(['home']);
 expect(design.navigation.initialScreen).toBe('home');
 expect(design.navigation.tabs.map(t=>t.screenId)).toEqual(['home']);
});
