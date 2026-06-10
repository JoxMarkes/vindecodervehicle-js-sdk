const str = (value) => (value == null ? '' : String(value));
const intOrNull = (value) => (value == null || value === '' ? null : Number(value));
const floatOrNull = (value) => (value == null || value === '' ? null : Number(value));

export function mapVehicle(data) {
  return {
    carId: Number(data.carId ?? 0),
    vin: str(data.vin),
    make: str(data.make),
    model: str(data.model),
    year: str(data.year),
    yearEnd: str(data.yearEnd),
    description: str(data.description),
    body: str(data.body),
    fuel: str(data.fuel),
    engine: str(data.engine),
    cubicCapacityCcm: intOrNull(data.cubicCapacityCcm),
    cubicCapacityLiters: floatOrNull(data.cubicCapacityLiters),
    powerHpFrom: intOrNull(data.powerHpFrom),
    powerHpTo: intOrNull(data.powerHpTo),
    kwPowerFrom: data.kwPowerFrom,
    kwPowerTo: data.kwPowerTo,
    cylinder: intOrNull(data.cylinder),
    drive: str(data.drive),
    valves: intOrNull(data.valves),
    fuelMixtureFormation: str(data.fuelMixtureFormation),
    aspiration: str(data.aspiration),
    cylinderDesign: str(data.cylinderDesign),
    coolingType: str(data.coolingType),
    tonnage: str(data.tonnage),
    axleLoadFromKg: data.axleLoadFromKg,
    axleLoadToKg: data.axleLoadToKg,
    axleStyle: str(data.axleStyle),
    axleType: str(data.axleType),
    axleBody: str(data.axleBody),
    axleConfiguration: str(data.axleConfiguration),
    wheelMounting: str(data.wheelMounting),
    brakeType: str(data.brakeType),
    hmdMfrModelName: str(data.hmdMfrModelName),
  };
}

export function getVehicleFullName(vehicle) {
  return `${vehicle.make} ${vehicle.model} ${vehicle.description}`.trim();
}

export function mapFluidCapacity(data) {
  return {
    item: str(data.ItemMPText),
    qualifier: str(data.QualColTextStr),
    value: str(data.ValueText),
    quantityUnit: str(data.ADQuantityTextStr),
    additionalInfo: str(data.AddTextStr),
  };
}

export function mapOemPartGroup(data) {
  return {
    group: str(data.group),
    shortname: str(data.shortname),
    name: str(data.name),
    parts: Array.isArray(data.parts)
      ? data.parts.map((part) => ({
          manufacturer: str(part.manufacturer),
          oeNumber: str(part.oe_number),
        }))
      : [],
  };
}

export function mapRepairTime(data) {
  return {
    workName: str(data.workname),
    partName: str(data.partname),
    hours: str(data.hours),
  };
}

export function mapBrand(data) {
  return { name: str(data.name), slug: str(data.slug) };
}

export function mapVehicleModel(data) {
  return { name: str(data.name), slug: str(data.slug) };
}

export function mapVariant(data) {
  return {
    typeName: str(data.typeName),
    typeYears: str(data.typeYears),
    fullTitle: str(data.fullTitle),
  };
}

export function mapEngine(data) {
  return {
    brand: str(data.Brand),
    model: str(data.Model),
    description: str(data.Description),
    kiloWatts: intOrNull(data.kiloWatts),
    from: str(data.From),
    until: str(data.Until),
    engineDetails:
      data.EngineDetails && typeof data.EngineDetails === 'object' ? data.EngineDetails : {},
    get engineCode() {
      return data.EngineDetails?.EngineCode ? str(data.EngineDetails.EngineCode) : null;
    },
  };
}