export const SHOE_SIZE_ROWS = [
  { cm: '23.0 - 23.5 cm', eu: '37 - 38', us: '5.0 - 5.5', uk: '4.5 - 5.0' },
  { cm: '24.0 - 24.5 cm', eu: '39 - 40', us: '6.5 - 7.5', uk: '6.0 - 7.0' },
  { cm: '25.0 - 25.5 cm', eu: '40.5 - 41', us: '8.0 - 8.5', uk: '7.5 - 8.0' },
  { cm: '26.0 - 26.5 cm', eu: '42 - 42.5', us: '9.0 - 9.5', uk: '8.5 - 9.0' },
  { cm: '27.0 - 27.5 cm', eu: '43 - 44', us: '10.0 - 10.5', uk: '9.5 - 10.0' },
];

export const MEN_CLOTHING_ROWS = [
  { size: 'S', height: '155 - 165 cm', weight: '50 - 58 kg', chest: '84 - 88 cm', waist: '68 - 74 cm' },
  { size: 'M', height: '165 - 172 cm', weight: '59 - 66 kg', chest: '89 - 93 cm', waist: '75 - 80 cm' },
  { size: 'L', height: '170 - 177 cm', weight: '67 - 75 kg', chest: '94 - 98 cm', waist: '81 - 86 cm' },
  { size: 'XL', height: '175 - 183 cm', weight: '76 - 84 kg', chest: '99 - 104 cm', waist: '87 - 93 cm' },
  { size: 'XXL', height: '> 180 cm', weight: '85 - 95 kg', chest: '105 - 110 cm', waist: '> 94 cm' },
];

export const WOMEN_CLOTHING_ROWS = [
  { size: 'S', height: '150 - 158 cm', weight: '42 - 48 kg', chest: '78 - 83 cm', hip: '84 - 88 cm' },
  { size: 'M', height: '158 - 165 cm', weight: '49 - 55 kg', chest: '84 - 89 cm', hip: '89 - 94 cm' },
  { size: 'L', height: '163 - 170 cm', weight: '56 - 63 kg', chest: '90 - 95 cm', hip: '95 - 100 cm' },
];

export function calculateClothingSize(
  gender: 'nam' | 'nu',
  height: number,
  weight: number
): { size: string; note: string } {
  // Đơn giản hóa theo chuẩn phom thể thao Việt Nam
  if (gender === 'nam') {
    if (weight < 55 && height < 165) return { size: 'S', note: 'Ôm vừa vặn người' };
    if (weight <= 65 && height <= 172) return { size: 'M', note: 'Chuẩn dáng thể thao' };
    if (weight <= 75 && height <= 178) return { size: 'L', note: 'Thoải mái vận động' };
    if (weight <= 85) return { size: 'XL', note: 'Rộng rãi thoáng khí' };
    return { size: 'XXL', note: 'Phù hợp người tập thể hình/vóc dáng to lớn' };
  }
  if (weight < 48 && height < 158) return { size: 'S', note: 'Tôn dáng thon gọn' };
  if (weight <= 55 && height <= 165) return { size: 'M', note: 'Chuẩn dáng nữ' };
  if (weight <= 62 && height <= 170) return { size: 'L', note: 'Thoải mái vận động' };
  return { size: 'XL', note: 'Rộng rãi dễ chịu' };
}

export function calculateShoeSize(cm: number): { eu: string; us: string; uk: string } {
  if (cm <= 23.0) return { eu: '37', us: '5.0', uk: '4.5' };
  if (cm <= 23.5) return { eu: '38', us: '5.5', uk: '5.0' };
  if (cm <= 24.0) return { eu: '39', us: '6.5', uk: '6.0' };
  if (cm <= 24.5) return { eu: '40', us: '7.5', uk: '7.0' };
  if (cm <= 25.0) return { eu: '40.5', us: '8.0', uk: '7.5' };
  if (cm <= 25.5) return { eu: '41', us: '8.5', uk: '8.0' };
  if (cm <= 26.0) return { eu: '42', us: '9.0', uk: '8.5' };
  if (cm <= 26.5) return { eu: '42.5', us: '9.5', uk: '9.0' };
  if (cm <= 27.0) return { eu: '43', us: '10.0', uk: '9.5' };
  if (cm <= 27.5) return { eu: '44', us: '10.5', uk: '10.0' };
  return { eu: '45+', us: '11.5+', uk: '11.0+' };
}
