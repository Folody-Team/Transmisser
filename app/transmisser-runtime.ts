import crypto from 'crypto'

export type node = {
  tag: string;
  child: Array<node>;
  atr: Array<any>;
}

export function init(container: string, child: Array<node>) {
  var l = 0;
  var r = child.length-1;

  const initElement = (id: number) => {
    const element = document.createElement(child[id].tag);
    const idattr = crypto.randomBytes(20).toString('hex');
    element.id = idattr

    if(child[id].atr) {
      for(const atr of child[id].atr) {
        if((atr.name as string).startsWith('on')) {
          element.addEventListener((atr.name as string).replace('on', '').toLowerCase(), atr.value)
        } else {
          if(atr.name == 'textContent') {
            element.textContent = atr.value;
          } else if(atr.name == 'innerHTML') {
            element.innerHTML = atr.value;
          } else {
            element.setAttribute(atr.name as string, atr.value)

          }

        }
      }
      
    }

    document.getElementById(container)?.appendChild(element);

    if(child[id].child) {
      init(idattr, child[id].child);
    }
  }
  while(l <= r) {
    if(l == r) {
      initElement(l);
    } else {
      Promise.all([initElement(l), initElement(r)])
    }

    ++l;
    --r;
  }
  
}