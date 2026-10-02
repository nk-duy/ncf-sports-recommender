import os

components_dir = 'd:/Projects/ncf-sports-recommender/frontend/src/modules/product_detail/components'

with open('d:/Projects/ncf-sports-recommender/temp_main.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace class= with className=
content = content.replace('class="', 'className="')

def extract_block(start_marker, end_marker):
    start_idx = content.find(start_marker)
    if start_idx == -1: return ''
    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1: return ''
    return content[start_idx:end_idx].strip()

info_jsx = extract_block('{/* Right Column: Purchasing & Specifications (5 cols ~ 42%) */}', '{/* Frequently Bought Together / AI Bundle Module */}')
info_lines = info_jsx.split('\n')

# We know the last two lines are </div> and </div> which close the parent grid.
# Find the last </div> and remove it twice.
while len(info_lines) > 0 and info_lines[-1].strip() == '':
    info_lines.pop()

if info_lines[-1].strip() == '</div>':
    info_lines.pop()
if info_lines[-1].strip() == '</div>':
    info_lines.pop()

info_jsx = '\n'.join(info_lines)

# Inject the dynamic bindings
info_jsx = info_jsx.replace('Giày Chạy Bộ Marathon Carbon Alpha Pro', '{product.name}')
info_jsx = info_jsx.replace('2.450.000 đ', '{formatPrice(product.price)}')
info_jsx = info_jsx.replace('2.890.000 đ', '{formatPrice(product.price * 1.2)}')
info_jsx = info_jsx.replace('id="selectedColorName">Xanh / Trắng Carbon', 'id="selectedColorName">{selectedColor}')

# Colors
info_jsx = info_jsx.replace('className="color-btn active group', 'className={`group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg transition-colors ${selectedColor === "Xanh / Trắng Carbon" ? "shadow-sm border border-primary/20 bg-surface-container-low" : "hover:bg-surface-container-high"}`} onClick={() => { setSelectedColor("Xanh / Trắng Carbon"); setMainImage("https://lh3.googleusercontent.com/aida/AEtjO1X0GYFJwVR-Lm_MCL3yDf1dmYd9PEaoWx9AghA9qB1ENT8OYO0Yx2RSywbyg9j9aQzNFRIoG5o3wrc_ldekxBqwycGtmzJcWcHf612b1T_7zCIwmeKlzsKOAq6zwmJ-CddWgSOIjALrSJoYIDRi313ayHwI5G46whKzfYJUHzflWEf6UYFQdS4yOacI0jWsjiihMFRDRpnMGquoazt52j4cMUPAkZC5h2Z4G8I5sbM9SLz13zjEqs8oqz8"); }}')
info_jsx = info_jsx.replace('className="color-btn group', 'className={`group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg transition-colors ${selectedColor === "Đen Neon Stealth" ? "shadow-sm border border-primary/20 bg-surface-container-low" : "hover:bg-surface-container-high"}`} onClick={() => { setSelectedColor("Đen Neon Stealth"); setMainImage("https://lh3.googleusercontent.com/aida/AEtjO1U0LCWxG7Lffv7kJCZhFlxFWtPCC9oIhCZuxivhH80pCBmcBdHoUEkfBW0LvQxsCIanNEbfug8eH-TjCQJeDhdqk_t0s7EVvJIFQo2l4u2MQfHhcaahOLYIuufvn8RNN1cGQkAUmlRye2OwOBXgCbWfSvx3FJDH7B_0jq-yRoRFA6uluf_kQjNekCRn5AqgQWYlIWgFAbk0_-gw-68YnCCEP-uk9uvTisABOEB4_DqLWtFZrAebLfsrOO8"); }}', 1)
info_jsx = info_jsx.replace('className="color-btn group', 'className={`group flex items-center gap-space-xs px-space-md py-2 bg-surface-container-lowest rounded-lg transition-colors ${selectedColor === "Trắng Tối giản Pure" ? "shadow-sm border border-primary/20 bg-surface-container-low" : "hover:bg-surface-container-high"}`} onClick={() => { setSelectedColor("Trắng Tối giản Pure"); setMainImage("https://lh3.googleusercontent.com/aida/AEtjO1X51cBnOfhu9k0FvCIfBv8sEnkZB1oyBbfchPdhy4KeWh_HeRp5DQpdZITC4Ktr7lUDYcFxkqV4QZ-wXronOb4hKXROV7UrNmL5trxm2tEd9wqB2_e7kTNX2GAPzbZKhrFPUGSPMZ5ZuXmVxkI0Mxojd6N5SjvifBdizx732NRuRhz_z6nCgqFj5oxPdmzFHFQWCbLp3OtpuqLXwOrfMVaYk_ngFNj_dNRijWX6CgIY9zdhuZcgzYRliUI"); }}', 1)

# Sizes
for size in ['39', '40', '41', '42', '43', '44']:
    old_active = f'className="size-btn active py-2.5 bg-on-surface text-surface font-data-mono font-bold rounded text-center shadow-sm">{size}</button>'
    old_normal = f'className="size-btn py-2.5 bg-surface-container-lowest text-on-surface font-data-mono font-bold rounded text-center hover:bg-surface-container-high transition-all">{size}</button>'
    new_btn = f'className={{`py-2.5 font-data-mono font-bold rounded text-center transition-all ${{selectedSize === "{size}" ? "bg-on-surface text-surface shadow-sm" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container-high"}}`}} onClick={{() => setSelectedSize("{size}")}}>{size}</button>'
    info_jsx = info_jsx.replace(old_active, new_btn)
    info_jsx = info_jsx.replace(old_normal, new_btn)

# Quantity
info_jsx = info_jsx.replace('id="qtyDec">-</button>', 'onClick={() => setQuantity(max(1, quantity - 1))}>-</button>')
info_jsx = info_jsx.replace('id="qtyInc">+</button>', 'onClick={() => setQuantity(quantity + 1)}>+</button>')
info_jsx = info_jsx.replace('id="qtyVal">1</span>', '>{quantity}</span>')
info_jsx = info_jsx.replace('max(1', 'Math.max(1')

with open(os.path.join(components_dir, 'ProductInfo.tsx'), 'w', encoding='utf-8') as f:
    f.write('''import React from "react";

interface Props {
    product: any;
    formatPrice: (price: number) => string;
    selectedColor: string;
    setSelectedColor: (color: string) => void;
    setMainImage: (url: string) => void;
    selectedSize: string;
    setSelectedSize: (size: string) => void;
    quantity: number;
    setQuantity: (qty: number) => void;
}

export default function ProductInfo({
    product, formatPrice, selectedColor, setSelectedColor, setMainImage, selectedSize, setSelectedSize, quantity, setQuantity
}: Props) {
    return (
<>
''' + info_jsx + '''
</>
    );
}
''')
print("Fixed ProductInfo.tsx")
