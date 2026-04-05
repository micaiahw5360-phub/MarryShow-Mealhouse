import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { adminService, itemsService } from '../../services/api';
import { toast } from 'sonner';

export function ManageItemOptions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<any>(null);
  const [options, setOptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [optionForm, setOptionForm] = useState({
    name: '',
    values: [{ name: '', priceModifier: 0 }],
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      try {
        const itemData = await itemsService.getItem(parseInt(id));
        setItem(itemData);
        const opts = await adminService.getOptions(parseInt(id));
        setOptions(opts);
      } catch (error) {
        toast.error('Failed to load options');
        navigate('/admin/menu');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleAddValue = () => {
    setOptionForm({
      ...optionForm,
      values: [...optionForm.values, { name: '', priceModifier: 0 }],
    });
  };

  const handleRemoveValue = (index: number) => {
    const newValues = optionForm.values.filter((_, i) => i !== index);
    setOptionForm({ ...optionForm, values: newValues });
  };

  const handleValueChange = (index: number, field: string, value: any) => {
    const newValues = [...optionForm.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setOptionForm({ ...optionForm, values: newValues });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!optionForm.name) {
      toast.error('Please enter an option name');
      return;
    }

    if (optionForm.values.some((v) => !v.name)) {
      toast.error('Please fill in all value names');
      return;
    }

    try {
      await adminService.addOption(parseInt(id!), {
        name: optionForm.name,
        values: optionForm.values,
      });
      toast.success('Option added successfully!');
      // Refresh options
      const opts = await adminService.getOptions(parseInt(id!));
      setOptions(opts);
      setShowDialog(false);
      setOptionForm({
        name: '',
        values: [{ name: '', priceModifier: 0 }],
      });
    } catch (error) {
      toast.error('Failed to add option');
    }
  };

  if (loading) return <div className="text-center py-20">Loading options...</div>;
  if (!item) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Button variant="ghost" onClick={() => navigate('/admin/menu')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Menu
        </Button>
        <h2 className="text-2xl font-bold">Manage Item Options</h2>
        <p className="text-gray-600 mt-1">Configure options for {item.name}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Options</CardTitle>
            <Button onClick={() => setShowDialog(true)} className="bg-[#074af2] hover:bg-[#0639c0]">
              <Plus className="w-4 h-4 mr-2" />
              Add Option
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {options.length > 0 ? (
            <div className="space-y-6">
              {options.map((option) => (
                <Card key={option.id} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">{option.name}</h3>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {option.values.map((value: any) => (
                        <div
                          key={value.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <span>{value.name}</span>
                          <span className="text-sm text-gray-600">
                            {value.priceModifier === 0
                              ? 'No extra charge'
                              : `+$${value.priceModifier.toFixed(2)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No options configured yet</p>
              <Button onClick={() => setShowDialog(true)}>Add Your First Option</Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Option Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Option</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="optionName">Option Name</Label>
              <Input
                id="optionName"
                value={optionForm.name}
                onChange={(e) => setOptionForm({ ...optionForm, name: e.target.value })}
                placeholder="e.g., Size, Toppings, Spice Level"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>Option Values</Label>
                <Button type="button" size="sm" variant="outline" onClick={handleAddValue}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>
              <div className="space-y-3">
                {optionForm.values.map((value, index) => (
                  <div key={index} className="flex space-x-3 items-end">
                    <div className="flex-1">
                      <Label htmlFor={`valueName-${index}`}>Value Name</Label>
                      <Input
                        id={`valueName-${index}`}
                        value={value.name}
                        onChange={(e) => handleValueChange(index, 'name', e.target.value)}
                        placeholder="e.g., Small, Medium, Large"
                        required
                      />
                    </div>
                    <div className="w-32">
                      <Label htmlFor={`priceModifier-${index}`}>Price +/-</Label>
                      <Input
                        id={`priceModifier-${index}`}
                        type="number"
                        step="0.01"
                        value={value.priceModifier}
                        onChange={(e) =>
                          handleValueChange(index, 'priceModifier', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0.00"
                      />
                    </div>
                    {optionForm.values.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveValue(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button type="submit" className="bg-[#074af2] hover:bg-[#0639c0]">
                Add Option
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}