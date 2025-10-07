"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconLayoutColumns,
  IconSearch,
  IconX,
  IconEye,
  IconPackage,
  IconCoins,
  IconTrendingUp,
  IconShoppingCart,
  IconArrowsExchange,
  IconHash,
  IconFileText,
  IconTag,
  IconCircleCheck,
  IconCircleDashed,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export const produtoSchema = z.object({
  CODPROD: z.number(),
  DESCRICAO: z.string(),
  QT_ESTOQUE_INICIAL: z.number(),
  CUSTO_FINANCEIRO: z.number(),
  CUSTO_CONTABIL: z.number(),
  QT_EST_TRANSF: z.number(),
  PVENDA_ICAL: z.number(),
  QT_EST_TRIANG: z.number(),
  QT_SALDO_ATRIANG: z.number(),
  QT_SALDO_ATRANSF: z.number(),
  QT_VENDA_REAL: z.number(),
  TIPO_PRODUTO: z.string(),
  QT_SALDO_ICAL: z.number(),
})

export const notaFiscalSchema = z.object({
  CODFILIAL: z.string(),
  DTSAIDA: z.string(),
  NUMTRANSVENDA: z.number(),
  NUMNOTA: z.number(),
  TIPOVENDA: z.string(),
  VLTOTAL: z.number(),
  NUMITENS: z.number(),
  SITUACAONFE: z.number(),
  CHAVENFE: z.string(),
  ROTINACAD: z.string(),
  ENTRADA: z.number(),
})

export const detalheMovimentoSchema = z.object({
  CODFILIAL: z.string(),
  NUMNOTA: z.number(),
  NUMTRANSVENDA: z.number(),
  CODPROD: z.number(),
  DESCRICAO: z.string(),
  CODOPER: z.string(),
  QUANTIDADE: z.number(),
  VLR_UNIT: z.number(),
  VLR_TOTAL: z.number(),
  VLR_VENDA_GERENCIAL: z.number(),
  VLR_TOTAL_GERENCIAL: z.number(),
})

const createProdutoColumns = (
  onViewDetails: (produto: z.infer<typeof produtoSchema>) => void
): ColumnDef<z.infer<typeof produtoSchema>>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const isConcluido = row.original.QT_SALDO_ICAL <= 0
      return (
        <div className="flex items-center justify-center">
          {isConcluido ? (
            <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <IconCircleCheck className="size-3" />
              Concluído
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1">
              <IconCircleDashed className="size-3" />
              Ativo
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "CODPROD",
    header: "Código",
    enableHiding: false,
  },
  {
    accessorKey: "DESCRICAO",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate">
        {row.original.DESCRICAO}
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "QT_ESTOQUE_INICIAL",
    header: () => <div className="text-right">Saldo Inicial</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.QT_ESTOQUE_INICIAL.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "QT_SALDO_ICAL",
    header: () => <div className="text-right">Saldo ICal</div>,
    cell: ({ row }) => {
      const saldo = row.original.QT_SALDO_ICAL
      const isConcluido = saldo <= 0
      return (
        <div className={`text-right font-semibold ${isConcluido ? 'text-green-600 dark:text-green-400' : ''}`}>
          {saldo.toFixed(2)}
        </div>
      )
    },
  },
  {
    accessorKey: "CUSTO_FINANCEIRO",
    header: () => <div className="text-right">Custo</div>,
    cell: ({ row }) => (
      <div className="text-right">
        R$ {row.original.CUSTO_FINANCEIRO.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "PVENDA_ICAL",
    header: () => <div className="text-right">Preço Venda</div>,
    cell: ({ row }) => (
      <div className="text-right">
        R$ {row.original.PVENDA_ICAL.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "TIPO_PRODUTO",
    header: "Tipo",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5 text-xs">
        {row.original.TIPO_PRODUTO}
      </Badge>
    ),
  },
  {
    accessorKey: "QT_VENDA_REAL",
    header: () => <div className="text-right">Vendas</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.QT_VENDA_REAL.toFixed(2)}
      </div>
    ),
  },
  {
    id: "actions",
    header: () => <div className="text-center">Ações</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={(e) => {
            e.stopPropagation()
            onViewDetails(row.original)
          }}
        >
          <IconEye className="size-4" />
          <span className="sr-only">Ver detalhes</span>
        </Button>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

const notaFiscalColumns: ColumnDef<z.infer<typeof notaFiscalSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "NUMNOTA",
    header: "Nº Nota",
    enableHiding: false,
  },
  {
    accessorKey: "DTSAIDA",
    header: "Data Saída",
    cell: ({ row }) => {
      const date = new Date(row.original.DTSAIDA)
      return date.toLocaleDateString('pt-BR')
    },
  },
  {
    accessorKey: "CODFILIAL",
    header: "Filial",
  },
  {
    accessorKey: "TIPOVENDA",
    header: "Tipo",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5 text-xs">
        {row.original.TIPOVENDA}
      </Badge>
    ),
  },
  {
    accessorKey: "VLTOTAL",
    header: () => <div className="text-right">Valor Total</div>,
    cell: ({ row }) => (
      <div className="text-right">
        R$ {row.original.VLTOTAL.toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "NUMITENS",
    header: () => <div className="text-right">Itens</div>,
    cell: ({ row }) => (
      <div className="text-right">
        {row.original.NUMITENS}
      </div>
    ),
  },
  {
    accessorKey: "SITUACAONFE",
    header: "Situação",
    cell: ({ row }) => (
      <Badge variant={row.original.SITUACAONFE === 100 ? "default" : "secondary"} className="text-xs">
        {row.original.SITUACAONFE === 100 ? "Autorizada" : `Status ${row.original.SITUACAONFE}`}
      </Badge>
    ),
  },
  {
    accessorKey: "ENTRADA",
    header: "Ocorrência Entrada",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.ENTRADA > 0 ? (
          <>
            <Badge variant="default" className="text-xs bg-green-600 hover:bg-green-700">
              Registrada
            </Badge>
            <span className="text-xs text-muted-foreground">#{row.original.ENTRADA}</span>
          </>
        ) : (
          <Badge variant="secondary" className="text-xs">
            Sem Entrada
          </Badge>
        )}
      </div>
    ),
  },
]

function DraggableRowProduto({ row }: { row: Row<z.infer<typeof produtoSchema>> }) {
  const { transform, transition, setNodeRef, isDragging, attributes, listeners } = useSortable({
    id: row.original.CODPROD,
  })
  
  const isConcluido = row.original.QT_SALDO_ICAL <= 0

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      data-concluido={isConcluido}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[concluido=true]:bg-green-50/50 dark:data-[concluido=true]:bg-green-950/20"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
      {...attributes}
    >
      {row.getVisibleCells().map((cell) => {
        const isDraggable = cell.column.id !== 'actions' && cell.column.id !== 'select'
        return (
          <TableCell 
            key={cell.id}
            {...(isDraggable ? listeners : {})}
            style={{ cursor: isDraggable ? 'grab' : 'default' }}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        )
      })}
    </TableRow>
  )
}

export function DataTable({
  data: initialDataProdutos,
  notasfiscais,
  detalhemovimento,
}: {
  data: z.infer<typeof produtoSchema>[]
  notasfiscais: z.infer<typeof notaFiscalSchema>[]
  detalhemovimento: z.infer<typeof detalheMovimentoSchema>[]
}) {
  const [dataProdutos, setDataProdutos] = React.useState(() => initialDataProdutos)
  const [dataNotasFiscais] = React.useState(() => notasfiscais)
  const [dataDetalheMovimento] = React.useState(() => detalhemovimento)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [selectedProduto, setSelectedProduto] = React.useState<z.infer<typeof produtoSchema> | null>(null)
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState<"todos" | "ativos" | "concluidos">("todos")
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const handleViewDetails = React.useCallback((produto: z.infer<typeof produtoSchema>) => {
    setSelectedProduto(produto)
    setIsDialogOpen(true)
  }, [])

  const produtoColumns = React.useMemo(
    () => createProdutoColumns(handleViewDetails),
    [handleViewDetails]
  )

  const dataIdsProdutos = React.useMemo<UniqueIdentifier[]>(
    () => dataProdutos?.map(({ CODPROD }) => CODPROD) || [],
    [dataProdutos]
  )

  const produtosConcluidos = React.useMemo(() => 
    dataProdutos.filter(p => p.QT_SALDO_ICAL <= 0).length,
    [dataProdutos]
  )
  
  const produtosAtivos = React.useMemo(() => 
    dataProdutos.filter(p => p.QT_SALDO_ICAL > 0).length,
    [dataProdutos]
  )

  const filteredDataProdutos = React.useMemo(() => {
    if (statusFilter === "todos") return dataProdutos
    if (statusFilter === "ativos") return dataProdutos.filter(p => p.QT_SALDO_ICAL > 0)
    if (statusFilter === "concluidos") return dataProdutos.filter(p => p.QT_SALDO_ICAL <= 0)
    return dataProdutos
  }, [dataProdutos, statusFilter])

  const tableProdutos = useReactTable({
    data: filteredDataProdutos,
    columns: produtoColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.CODPROD.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const tableNotasFiscais = useReactTable({
    data: dataNotasFiscais,
    columns: notaFiscalColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.NUMNOTA.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEndProdutos(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setDataProdutos((data) => {
        const oldIndex = dataIdsProdutos.indexOf(active.id)
        const newIndex = dataIdsProdutos.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <>
      <Tabs
        defaultValue="outline"
        className="w-full flex-col justify-start gap-6"
      >
      <div className="flex flex-col gap-4 px-4 lg:px-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="view-selector" className="sr-only">
            View
          </Label>
          <Select defaultValue="outline">
            <SelectTrigger
              className="flex w-fit @4xl/main:hidden"
              size="sm"
              id="view-selector"
            >
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="outline">Produtos</SelectItem>
              <SelectItem value="past-performance">Notas Fiscais</SelectItem>
            </SelectContent>
          </Select>
          <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
            <TabsTrigger value="outline">Produtos</TabsTrigger>
            <TabsTrigger value="past-performance">
              Notas Fiscais
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2 mr-2">
              <Badge variant="outline" className="gap-1">
                <IconCircleDashed className="size-3" />
                {produtosAtivos}
              </Badge>
              <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <IconCircleCheck className="size-3" />
                {produtosConcluidos}
              </Badge>
            </div>
            <Select value={statusFilter} onValueChange={(value: "todos" | "ativos" | "concluidos") => setStatusFilter(value)}>
              <SelectTrigger className="w-[140px]" size="sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="ativos">
                  <div className="flex items-center gap-2">
                    <IconCircleDashed className="size-3" />
                    Ativos
                  </div>
                </SelectItem>
                <SelectItem value="concluidos">
                  <div className="flex items-center gap-2">
                    <IconCircleCheck className="size-3" />
                    Concluídos
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <IconLayoutColumns />
                  <span className="hidden lg:inline">Personalizar Colunas</span>
                  <span className="lg:hidden">Colunas</span>
                  <IconChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {tableProdutos
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" &&
                      column.getCanHide()
                  )
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por código ou descrição do produto..."
            value={(tableProdutos.getColumn("DESCRICAO")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              tableProdutos.getColumn("DESCRICAO")?.setFilterValue(event.target.value)
            }
            className="h-9 pl-9 pr-9"
          />
          {(tableProdutos.getColumn("DESCRICAO")?.getFilterValue() as string) && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 size-7 -translate-y-1/2"
              onClick={() => tableProdutos.getColumn("DESCRICAO")?.setFilterValue("")}
            >
              <IconX className="size-4" />
              <span className="sr-only">Limpar busca</span>
            </Button>
          )}
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEndProdutos}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {tableProdutos.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {tableProdutos.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIdsProdutos}
                    strategy={verticalListSortingStrategy}
                  >
                    {tableProdutos.getRowModel().rows.map((row) => (
                      <DraggableRowProduto key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={produtoColumns.length}
                      className="h-24 text-center"
                    >
                      Nenhum resultado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {tableProdutos.getFilteredSelectedRowModel().rows.length} de{" "}
            {tableProdutos.getFilteredRowModel().rows.length} produto(s) selecionado(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${tableProdutos.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  tableProdutos.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={tableProdutos.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {tableProdutos.getState().pagination.pageIndex + 1} de{" "}
              {tableProdutos.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => tableProdutos.setPageIndex(0)}
                disabled={!tableProdutos.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para primeira página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => tableProdutos.previousPage()}
                disabled={!tableProdutos.getCanPreviousPage()}
              >
                <span className="sr-only">Página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => tableProdutos.nextPage()}
                disabled={!tableProdutos.getCanNextPage()}
              >
                <span className="sr-only">Próxima página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => tableProdutos.setPageIndex(tableProdutos.getPageCount() - 1)}
                disabled={!tableProdutos.getCanNextPage()}
              >
                <span className="sr-only">Ir para última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {tableNotasFiscais.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {tableNotasFiscais.getRowModel().rows?.length ? (
                tableNotasFiscais.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={notaFiscalColumns.length}
                    className="h-24 text-center"
                  >
                    Nenhuma nota fiscal encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {tableNotasFiscais.getFilteredSelectedRowModel().rows.length} de{" "}
            {tableNotasFiscais.getFilteredRowModel().rows.length} nota(s) selecionada(s).
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page-nf" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${tableNotasFiscais.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  tableNotasFiscais.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page-nf">
                  <SelectValue
                    placeholder={tableNotasFiscais.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Página {tableNotasFiscais.getState().pagination.pageIndex + 1} de{" "}
              {tableNotasFiscais.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => tableNotasFiscais.setPageIndex(0)}
                disabled={!tableNotasFiscais.getCanPreviousPage()}
              >
                <span className="sr-only">Ir para primeira página</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => tableNotasFiscais.previousPage()}
                disabled={!tableNotasFiscais.getCanPreviousPage()}
              >
                <span className="sr-only">Página anterior</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => tableNotasFiscais.nextPage()}
                disabled={!tableNotasFiscais.getCanNextPage()}
              >
                <span className="sr-only">Próxima página</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => tableNotasFiscais.setPageIndex(tableNotasFiscais.getPageCount() - 1)}
                disabled={!tableNotasFiscais.getCanNextPage()}
              >
                <span className="sr-only">Ir para última página</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <IconPackage className="size-5" />
            Detalhes do Produto
          </DialogTitle>
          <DialogDescription>
            Visualização completa das informações do produto
          </DialogDescription>
        </DialogHeader>
        {selectedProduto && (
          <div className="space-y-6">
            {/* Informações Básicas - Destaque */}
            <div className="rounded-lg border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent p-4">
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconHash className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Código do Produto</p>
                    <p className="text-lg font-bold tabular-nums">{selectedProduto.CODPROD}</p>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <IconTag className="size-3" />
                    {selectedProduto.TIPO_PRODUTO}
                  </Badge>
                </div>
                <div className="flex items-start gap-3 border-t pt-3">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <IconFileText className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Descrição</p>
                    <p className="text-sm font-medium leading-tight">{selectedProduto.DESCRICAO}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Estoque */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <IconPackage className="size-4 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-sm">Informações de Estoque</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="group rounded-xl border bg-gradient-to-br from-blue-50/80 to-blue-50/40 dark:from-blue-950/40 dark:to-blue-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <IconPackage className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Estoque Inicial</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {selectedProduto.QT_ESTOQUE_INICIAL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="group rounded-xl border bg-gradient-to-br from-blue-50/80 to-blue-50/40 dark:from-blue-950/40 dark:to-blue-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <IconPackage className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Saldo Atual</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-blue-600 dark:text-blue-400">
                    {selectedProduto.QT_SALDO_ICAL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="group rounded-xl border bg-gradient-to-br from-slate-50/80 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-900/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/50">
                      <IconArrowsExchange className="size-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Est. Transferência</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {selectedProduto.QT_EST_TRANSF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="group rounded-xl border bg-gradient-to-br from-slate-50/80 to-slate-50/40 dark:from-slate-900/40 dark:to-slate-900/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800/50">
                      <IconArrowsExchange className="size-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Est. Triangulação</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {selectedProduto.QT_EST_TRIANG.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Saldos Pendentes */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <IconArrowsExchange className="size-4 text-amber-600 dark:text-amber-400" />
                <h4 className="font-semibold text-sm">Saldos Pendentes</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="group rounded-xl border bg-gradient-to-br from-amber-50/80 to-amber-50/40 dark:from-amber-950/40 dark:to-amber-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <IconArrowsExchange className="size-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">A Transferir</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    {selectedProduto.QT_SALDO_ATRANSF.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="group rounded-xl border bg-gradient-to-br from-amber-50/80 to-amber-50/40 dark:from-amber-950/40 dark:to-amber-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/50">
                      <IconArrowsExchange className="size-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">A Triangular</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-amber-600 dark:text-amber-400">
                    {selectedProduto.QT_SALDO_ATRIANG.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>

            {/* Valores Financeiros */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <IconCoins className="size-4 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-sm">Valores Financeiros</h4>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="group rounded-xl border bg-gradient-to-br from-green-50/80 to-green-50/40 dark:from-green-950/40 dark:to-green-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <IconCoins className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Custo Financeiro</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-green-600 dark:text-green-400">
                    R$ {selectedProduto.CUSTO_FINANCEIRO.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="group rounded-xl border bg-gradient-to-br from-green-50/80 to-green-50/40 dark:from-green-950/40 dark:to-green-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                      <IconCoins className="size-4 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Custo Contábil</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    R$ {selectedProduto.CUSTO_CONTABIL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="group rounded-xl border bg-gradient-to-br from-emerald-50/80 to-emerald-50/40 dark:from-emerald-950/40 dark:to-emerald-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <IconTrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Preço de Venda</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                    R$ {selectedProduto.PVENDA_ICAL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="group rounded-xl border bg-gradient-to-br from-emerald-50/80 to-emerald-50/40 dark:from-emerald-950/40 dark:to-emerald-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <IconTrendingUp className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Margem de Lucro</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums">
                    {selectedProduto.CUSTO_FINANCEIRO > 0
                      ? `${(((selectedProduto.PVENDA_ICAL - selectedProduto.CUSTO_FINANCEIRO) / selectedProduto.CUSTO_FINANCEIRO) * 100).toFixed(2)}%`
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vendas e Total em Estoque */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <IconShoppingCart className="size-4 text-purple-600 dark:text-purple-400" />
                  <h4 className="font-semibold text-sm">Vendas</h4>
                </div>
                <div className="group rounded-xl border bg-gradient-to-br from-purple-50/80 to-purple-50/40 dark:from-purple-950/40 dark:to-purple-950/20 p-4 transition-all hover:shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <IconShoppingCart className="size-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Qtd. Vendida Real</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-purple-600 dark:text-purple-400">
                    {selectedProduto.QT_VENDA_REAL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div>
                <div className="mb-3 flex items-center gap-2">
                  <IconCoins className="size-4 text-primary" />
                  <h4 className="font-semibold text-sm">Valor Total</h4>
                </div>
                <div className="group rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-4 transition-all hover:shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20">
                      <IconCoins className="size-4 text-primary" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Total em Estoque</p>
                  </div>
                  <p className="text-2xl font-bold tabular-nums text-primary">
                    R$ {(selectedProduto.QT_SALDO_ICAL * selectedProduto.CUSTO_FINANCEIRO).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Baseado no custo financeiro</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  )
}

