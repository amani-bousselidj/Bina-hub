module.exports = function(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasChanged = false;

  root.find(j.ImportDeclaration)
    .forEach(path => {
      const src = path.value.source.value;
      // If import path contains '/ui/badge' or '/ui/card', use the central barrel
      if (/\/ui\/(badge|card)(\b|$)/.test(src)) {
        path.value.source.value = '@/components/ui';
        hasChanged = true;
      }
    });

  return hasChanged ? root.toSource({ quote: 'single' }) : null;
};
