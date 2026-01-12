// Libraries
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';

// UI
import { ToastContainer, toast } from 'react-toastify';
import { NavLink, useLocation, useParams, useNavigate } from 'react-router-dom';

// Personalized UI
import Loading from '@components/Loading';

// Services
import { apiUrl, apiOptions } from '@services/API';

// Styles
import '@styles/form.css';

const CategoryForm = () => {

    const { register, handleSubmit, watch, reset } = useForm();
    const defaultValues = {
        id: null,
        descricao: '',
        id_categoria: null
    };

    const [isLoading, setIsLoading] = useState(false);
    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);

    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    // Buscar categoria
    useEffect(() => {
        if (!params.hasOwnProperty('id')) {
            return;
        }

        const getCategory = async () => {
            try {
                setIsLoading(true);

                const endpoint = `category/${params.id}`;
                const completeUrl = `${apiUrl}${endpoint}`;

                const res = await fetch(completeUrl, apiOptions('GET'));
                const resData = await res.json();

                if (!res.ok) {
                    toast.warning(resData.message);
                } else {
                    setCategory(resData);
                    reset({ descricao: resData.descricao, id_categoria: resData.id_categoria });
                }
            } catch (error) {
                toast.error('Erro ao buscar categoria');
                console.debug(error);
            } finally {
                setIsLoading(false);
            }
        };

        getCategory();
    }, [location.pathname]);

    // Listar categorias
    useEffect(() => {
        const getCategories = async () => {
            try {
                setIsLoading(true);

                const res = await fetch(`${apiUrl}category/list`, apiOptions('GET'));
                const data = await res.json();

                if (!res.ok) {
                    toast.warning(data.message);
                } else {
                    setCategories(data);
                }
            } catch (error) {
                toast.error('Erro ao buscar todas as categorias');
                console.debug(error);
            } finally {
                setIsLoading(false);
            }
        };
        getCategories();
    }, []);

    // Validações
    const validations = async (data) => {
        try {
            setIsLoading(true);

            // Descrição não pode ser vazia
            if (!data.descricao || data.descricao.length == 0) {
                toast.warning('Preencha uma descrição!');
                return false;
            }

            if (data.hasOwnProperty('id_categoria')) {
                data.id_categoria = data.id_categoria === '' ? null : data.id_categoria;
            }

            return true;
        } catch (error) {
            toast.error('Erro ao realizar validações. Contate o suporte!');

            console.log('Erro ao realizar validações');
            console.error(error);

            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Botão Novo
    const handleNew = async () => {
        navigate('/category/form');
        reset({ ...defaultValues });
        setCategory({});
    }

    // Criar
    const create = async (data) => {

        const permittedColumns = ['descricao', 'id_categoria'];

        const payload = {};

        for (const column in data) {
            if (permittedColumns.includes(column)) {
                payload[column] = data[column];
            }
        }

        const endpoint = 'category';
        const completeUrl = `${apiUrl}${endpoint}`;

        const res = await fetch(completeUrl, apiOptions('POST', payload));
        const resData = await res.json();

        if (res.ok) {
            toast.success('Categoria criada!');
            reset({ descricao: resData.descricao, id_categoria: resData.id_categoria });
            // Adicionar categoria ao estado
            console.log(resData);
            setCategories([...categories, resData]);
        } else {
            toast.warning(resData.message);
        }

        return res.ok;
    };

    // Atualizar
    const update = async (data) => {

        const permittedColumns = ['descricao', 'id_categoria'];

        const payload = {};

        for (const column in data) {
            if (permittedColumns.includes(column)) {
                payload[column] = data[column];
            }
        }

        const endpoint = `category/${category.id}`;
        const completeUrl = `${apiUrl}${endpoint}`;

        const res = await fetch(completeUrl, apiOptions('PUT', payload));
        const resData = await res.json();

        if (res.ok) {
            toast.success('Atualização realizada!');
            // Atualizar categoria no estado
            setCategories(categories.map(cat => cat.id === category.id ? resData : cat));
        } else {
            toast.warning(resData.message);
        }
    };

    const onSubmit = async (data) => {
        if (isLoading) {
            return;
        }

        try {
            // Validações
            const validationsComplete = await validations(data);

            if (!validationsComplete) {
                return;
            }

            if (Object.keys(category).length > 0) {
                update(data);
            } else {
                create(data);
            }

        } catch (error) {
            toast.error('Erro desconhecido. Contate o suporte!');
            console.log('Erro ao enviar formulário');
            console.error(error);
        }
    };

    const tableColumns = {
        id: {
            display: 'ID',
        },
        descricao: {
            display: 'Descrição'
        },
        descricao_visual: {
            display: 'Hierarquia'
        }
    };

    return (
        <article className='d-flex align-items-top justify-content-center'>
            <div>
                {/* Título */}
                <div className='text-center'>
                    <h1 className='fw-bold'>Categorias</h1>
                    <p>Gerencie suas categorias de contas a pagar</p>
                </div>
                {/* Formulário */}
                <form action="#" className='card shadow-sm p-3 mb-3' onSubmit={handleSubmit(onSubmit)}>
                    {/* Botões */}
                    <div className='mb-3 d-flex flex-wrap justify-content-start gap-3'>
                        <button type='button' disabled={isLoading} onClick={handleNew} className={'btn btn-primary'} >Novo</button>
                        <button type='submit' disabled={isLoading} className='btn btn-success'>{Object.keys(category).length > 0 ? 'Atualizar' : 'Cadastrar'}</button>
                    </div>
                    {/* Descrição */}
                    <div className='d-flex flex-wrap justify-content-around gap-2'>
                        <div>
                            <label htmlFor='descricao' className='form-label'>Descrição</label>
                            <input type="text" id='descricao' className='form-control' placeholder='Digite a descrição' {...register('descricao')} />
                        </div>
                        <div>
                            <label htmlFor='id-categoria' className='form-label'>Categoria Pai</label>
                            <select id='id-categoria' className='form-select' defaultValue="" {...register('id_categoria')} >
                                <option value="">Selecione uma categoria</option>
                                {categories.map((category, index) => <option key={`category-${index}`} value={category.id} >{category.descricao_visual}</option>)}
                            </select>
                        </div>
                    </div>
                </form>
                {/* Tabela */}
                <div className='table-container container'>
                    <table className='table table-stripped'>
                        <thead>
                            <tr>
                                {Object.keys(tableColumns).map((col) => (
                                    <th className='text-center' key={col}>{tableColumns[col].display}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 ? (
                                <tr>
                                    <td colSpan={Object.keys(tableColumns).length} className='text-center'>Nenhuma categoria encontrada</td>
                                </tr>
                            ) : (
                                categories.map((row) => (
                                    <tr key={row.id} onClick={() => navigate(`/category/form/${row.id}`)} style={{ cursor: 'pointer' }}>
                                        {Object.keys(tableColumns).map((col) => {
                                            const colDef = tableColumns[col] || {};
                                            const value = row[col];
                                            const content = typeof colDef.format === 'function' ? colDef.format(value) : (value ?? '');
                                            return <td key={col}>{content}</td>;
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                {isLoading ? <Loading /> : <></>}
                <ToastContainer position='bottom-right' />
            </div>
        </article>
    )
};

export default CategoryForm;