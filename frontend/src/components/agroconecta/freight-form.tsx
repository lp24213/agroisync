'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Truck, MapPin, Package, DollarSign, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FreightData {
  id: string
  title: string
  origin: string
  destination: string
  grainType: string
  weight: number
  price: number
  status: 'available' | 'in_transit' | 'completed'
  transporter: string
  createdAt: Date
  coordinates: {
    origin: [number, number]
    destination: [number, number]
  }
}

interface FreightFormProps {
  onClose: () => void
  onSubmit: (freight: FreightData) => void
}

export function FreightForm({ onClose, onSubmit }: FreightFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    origin: '',
    destination: '',
    grainType: '',
    weight: '',
    price: '',
    transporter: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newFreight: FreightData = {
      id: Date.now().toString(),
      title: formData.title,
      origin: formData.origin,
      destination: formData.destination,
      grainType: formData.grainType,
      weight: parseFloat(formData.weight),
      price: parseFloat(formData.price),
      status: 'available',
      transporter: formData.transporter,
      createdAt: new Date(),
      coordinates: {
        origin: [-15.6014, -56.0979], // Mock coordinates
        destination: [-23.5505, -46.6333], // Mock coordinates
      },
    }
    
    onSubmit(newFreight)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="glass-card w-full max-w-2xl p-6 border border-border/50" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Novo Frete</h2>
                    <p className="text-sm text-muted-foreground">Preencha os dados do frete</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Título do Frete
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Ex: Frete Soja MT → SP"
                      required
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tipo de Grão
                    </label>
                    <select
                      name="grainType"
                      value={formData.grainType}
                      onChange={handleChange}
                      required
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Selecione o grão</option>
                      <option value="Soja">Soja</option>
                      <option value="Milho">Milho</option>
                      <option value="Trigo">Trigo</option>
                      <option value="Café">Café</option>
                      <option value="Arroz">Arroz</option>
                      <option value="Feijão">Feijão</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Origem
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleChange}
                        placeholder="Cidade, Estado"
                        required
                        className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Destino
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Cidade, Estado"
                        required
                        className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Peso (kg)
                    </label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        placeholder="30000"
                        required
                        min="1"
                        className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Preço (R$)
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="4500"
                        required
                        min="1"
                        step="0.01"
                        className="w-full bg-secondary border border-border rounded-lg pl-10 pr-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Transportadora
                  </label>
                  <input
                    type="text"
                    name="transporter"
                    value={formData.transporter}
                    onChange={handleChange}
                    placeholder="Nome da transportadora"
                    required
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border/30">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-neon-blue to-neon-cyan"
                  >
                    Criar Frete
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
