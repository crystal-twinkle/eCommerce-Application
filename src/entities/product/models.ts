export interface Product {
  id: string;
  masterData: ProductMasterData;
  key: string;
  taxCategory: {
    typeId: string;
    id: string;
  };
  lastVariantId: number;
}

export interface ProductMasterData {
  current: MasterData;
  staged: MasterData;
  published: boolean;
  hasStagedChanges: boolean;
}

export interface MasterData {
  name: Record<string, string>;
  categories: {
    typeId: string;
    id: string;
  }[];
  slug: Record<string, string>;
  masterVariant: {
    id: number;
    sku: number;
    key: number;
    prices: {
      id: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
      country: string;
    }[];
    images: {
      url: string;
      dimensions: {
        w: number;
        h: number;
      };
    }[];
    attributes: {
      name: string;
      value: {
        key: string;
        label: string;
      };
    }[];
    assets: [];
  };
  variants: {
    id: number;
    sku: number;
    key: number;
    prices: {
      id: string;
      value: {
        type: string;
        currencyCode: string;
        centAmount: number;
        fractionDigits: number;
      };
      country: string;
    }[];
    images: [
      {
        url: string;
        dimensions: {
          w: number;
          h: number;
        };
      },
    ];
    attributes: [
      {
        name: string;
        value: {
          key: string;
          label: string;
        };
      },
    ];
    assets: [];
  }[];
  searchKeywords: Record<string, string>;
}
