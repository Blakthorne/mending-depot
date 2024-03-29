// Create type structure for a book entry
type Book = {
    id?: string;
    title: string;
    author: string;
    publisher: string | null;
    yearPublished: string | number | null;
    numberOfPages: string | number | null;
    bindingTypeId: string;
    received: string | Date;
    returned: string | Date | null;
    bookMaterialsCost: string | number | null;
    amountCharged: string | number | null;
    ownerId: string;
}

// Create type structure for an owner entry
type Owner = {
    id?: string;
    ownerName: string;
}

// Create type structure for a binding type entry
type BindingType = {
    id?: string;
    bindingTypeName: string;
}

// Create type structure for an inventory transaction entry
type InventoryTransaction = {
    id?: string;
    datePurchased: string | Date;
    dateReceived: string | Date | null;
    unitsPurchased: string | number;
    transactionCost: string | number | null;
    materialId: string;
    providerId: string;
}

// Create type structure for a manufacturer entry
type Manufacturer = {
    id?: string;
    manufacturerName: string;
}

// Create type structure for a unit type entry
type UnitType = {
    id?: string;
    unitTypeName: string;
}

// Create type structure for a material for repair entry
type MaterialForRepair = {
    repairId: string;
    materialId: string;
    amountUsed: string | number;
    materialCost?: string | number;
    id?: string;
}

// Create type structure for a type for material width entry
type MaterialWidth = {
    materialForRepairId: string;
    measurement: string | number;
}

// Create type structure for a type for material height entry
type MaterialHeight = {
    materialForRepairId: string;
    measurement: string | number;
}

// Create type structure for a type for materials type entry
type TypeForMaterial = {
    materialId: string;
    materialTypeId: string;
}

// Create type structure for a material entry
type Material = {
    id?: string;
    materialName: string;
    unitCost: string | number;
    unitTypeId: string;
    manufacturerId: string;
}

// Create type structure for a material type entry
type MaterialType = {
    id?: string;
    materialTypeName: string;
}

// Create type structure for a provider entry
type Provider = {
    id?: string;
    providerName: string;
}

// Create type structure for a repair entry
type Repair = {
    id?: string;
    repairTypeId: string;
    repairMaterialsCost: string | number | null;
    bookId: string;
}

// Create type structure for a repair type entry
type RepairType = {
    id?: string;
    repairTypeName: string;
}