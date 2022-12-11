let data = document.documentElement.innerText.split(' ').map(el => el-0);
let metaCount = 0;

[tree,_] = parseNode(0);

console.log('task1: ' + metaCount);
console.log('task2: ' + getValue(tree));

function parseNode(index) {
    let numChilds = data[index++];
    let numMetas = data[index++];
	let childs = [];
    for (let i = 0; i < numChilds; i++) {
		[c,index] = parseNode(index);
        childs.push(c);
    }
	let metas = [];
    for (let i = 0; i < numMetas; i++) {
		let m = data[index];
        metas.push(m);
		metaCount += m;
		index++;
    }
    return [{childs, metas}, index];
}

function getValue(node) {
    if (node.childs.length === 0) {
		return node.metas.reduce((a,b) => a + b);
    } else {
		let sum = 0;
        node.metas.forEach(m => {
			let child = node.childs[m-1];
            if (child) sum += getValue(child);
        });
        return sum;
    }
}
