module.exports = function(fileInfo, { jscodeshift: j }) {
  const root = j(fileInfo.source);
  let hasChanged = false;

  root.find(j.ImportDeclaration)
    .filter(path => {
      const src = path.node.source.value;
      // match absolute and relative badge/card imports
      return /(^@\/components\/ui\/(badge|card)$)|(\.\.?(\/ui\/(badge|card))$)/.test(src);
    })
    .forEach(path => {
      path.node.source.value = '@/components/ui';
      hasChanged = true;
    });

  return hasChanged ? root.toSource({ quote: 'single' }) : null;
};
