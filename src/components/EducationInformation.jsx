import FormInput from './FormInput'
import SectionCard from './SectionCard'

function EducationInformation({ records, errors, onChange, onAdd, onRemove }) {
  return <SectionCard number="04" title="Education" description="Add your most relevant academic qualifications.">
    <div className="record-list">{records.map((record, index) => 
        <div className="record-block" key={`education-${index}`}>
            <div className="record-title">
                <h3>Qualification {index + 1}</h3>
                {records.length > 1 && 
                <button className="btn btn-link remove-button" type="button" onClick={() => onRemove(index)}>Remove</button>}</div>
                <div className="row">
                    <div className="col-md-6"><FormInput label="Highest qualification" name={`qualification-${index}`} value={record.qualification} onChange={(value) => onChange(index, 'qualification', value)} error={errors[index]?.qualification} placeholder="e.g. Bachelor of Technology" /></div>
                    <div className="col-md-6"><FormInput label="College / university name" name={`institution-${index}`} value={record.institution} onChange={(value) => onChange(index, 'institution', value)} error={errors[index]?.institution} /></div>
                    <div className="col-md-4"><FormInput label="Board / university" name={`board-${index}`} value={record.board} onChange={(value) => onChange(index, 'board', value)} error={errors[index]?.board} /></div>
                    <div className="col-md-4"><FormInput label="Passing year" name={`passingYear-${index}`} value={record.passingYear} onChange={(value) => onChange(index, 'passingYear', value)} error={errors[index]?.passingYear} placeholder="YYYY" /></div>
                    <div className="col-md-4"><FormInput label="Percentage / CGPA" name={`score-${index}`} value={record.score} onChange={(value) => onChange(index, 'score', value)} error={errors[index]?.score} placeholder="0 - 100" /></div></div></div>)}</div><button className="btn btn-outline-primary add-button" type="button" onClick={onAdd}><span aria-hidden="true">+</span> Add another qualification</button></SectionCard>
}

export default EducationInformation