import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface ComparisonRow {
  feature: string;
  rfpquest: boolean | string;
  competitor1?: boolean | string;
  competitor2?: boolean | string;
}

interface ComparisonTableProps {
  title?: string;
  subtitle?: string;
  headers: string[];
  rows: ComparisonRow[];
}

export function ComparisonTable({ title, subtitle, headers, rows }: ComparisonTableProps) {
  const renderCell = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon className="w-6 h-6 text-blue-500 mx-auto" />
      ) : (
        <XMarkIcon className="w-6 h-6 text-slate-400 dark:text-slate-300 mx-auto" />
      );
    }
    return <span className="text-sm text-slate-200 dark:text-slate-400">{value}</span>;
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4">
        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-slate-100 dark:text-white mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-slate-300 dark:text-slate-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 md:px-6 py-4 text-left ${
                      index === 0
                        ? 'text-slate-100 dark:text-white'
                        : 'text-center'
                    } ${
                      index === 1
                        ? 'bg-blue-950/20 dark:bg-blue-950/20 text-blue-400 dark:text-blue-400 font-bold'
                        : 'text-slate-300 dark:text-slate-400'
                    } text-sm md:text-base font-semibold border-b-2 border-slate-700/50 dark:border-slate-300/50`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-slate-700/40 dark:border-slate-200/40 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 md:px-6 py-4 text-slate-100 dark:text-white font-medium">
                    {row.feature}
                  </td>
                  <td className="px-4 md:px-6 py-4 text-center bg-blue-950/20/50 dark:bg-blue-950/10">
                    {renderCell(row.rfpquest)}
                  </td>
                  {row.competitor1 !== undefined && (
                    <td className="px-4 md:px-6 py-4 text-center">
                      {renderCell(row.competitor1)}
                    </td>
                  )}
                  {row.competitor2 !== undefined && (
                    <td className="px-4 md:px-6 py-4 text-center">
                      {renderCell(row.competitor2)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
